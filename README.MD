# Objectivize

[![Build Status](https://travis-ci.org/ryandabler/objectivize.svg?branch=master)](https://travis-ci.org/ryandabler/objectivize)
[![Coverage Status](https://coveralls.io/repos/github/ryandabler/objectivize/badge.svg?branch=master)](https://coveralls.io/github/ryandabler/objectivize?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/a8cead71f83246940397/maintainability)](https://codeclimate.com/github/ryandabler/objectivize/maintainability)
[![npm](https://img.shields.io/npm/v/objectivize.svg)](https://www.npmjs.com/package/objectivize)

Objectivize is an object utility library.

## Requirements

Objectivize will work on any environment that supports ES6 or higher.

## Installation

### Node

To install the Objectivize library in a Node environment, run

```
npm install objectivize
```

### Browser

Tupos can also be run in a browser environment. The easiest way is to use unpkg and include in a `<script>` tag:

```html
<script src="https://unpkg.com/browse/objectivize@2.0.0/lib/objectivize.min.js">
```

This script will add an `objectivize` key to the `window` object, with the below API exposed through it. Only v2.0.0 or higher are bundled for a browser.

## API

### `get(object, path, notFound?)`

Recurses through an object given a particular path and returns the value found at the end or a fallback value (if one supplied).

A valid path can be a string, symbol, number, or array of any combination of those three types. If the path is a string, it will be split on any `.` to generate an array of keys.

#### Arguments

-   `object` _{Object}_: The object to traverse
-   `path` _{string | number | symbol | Array<string | number | symbol>}_: The path by which to traverse the object
-   `notFound` _{\*}_: The value returned if the path does not resolve in the object

#### Returns

-   _{\*}_: The value at the resolved path or the `notFound` value

#### Example

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};

get(obj, 'a'); // { b: { c: 1, d: 2 } }
get(obj, 'a.b'); // { c: 1, d: 2 }
get(obj, ['a', 'b', 'd']); // 2
get(obj, 'c'); // undefined
get(obj, 'c', 'fallback'); // 'fallback'
```

### `set(object, path, value)`

Recurses down an object to set a value at the end of a particular path. If at any point the path becomes non-existent, it will be generated during the traversal. If at any point the path hits a non-traversable point (e.g., a number), it will abort.

#### Arguments

-   `object` _{Object}_: The object to traverse
-   `path` _{string | number | symbol | Array<string | number | symbol>}_: The path by which to traverse the object
-   `value` _{\*}_: The value to be set at the resolved path

#### Returns

-   _{boolean}_: `true` if the set was successful and `false` otherwise

#### Example

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};

set(obj, 'a.b', [1, 2, 3]); // { a: { b: [ 1, 2, 3 ] } }
set(obj, 'a.d', true); // { a: { b: { c: 1, d: 2 }, d: true } }
set(obj, 'a.b.c.d', 'value'); // { a: { b: { c: 1, d: 2 } } }
```

### `update(object, path, updateFn)`

Recurses down an object and passes the particular value into a function and replaces it with that function's return value. It returns `true` to indicate success and `false` otherwise.

#### Arguments

-   `object` _{Object}_: The object to traverse
-   `path` _{string | number | symbol | Array<string | number | symbol>}_: The path by which to traverse the object
-   `updateFn` _{Function(*): *}_: The function called with the value at the resolved path

#### Returns

-   _{boolean}_: `true` if the update was successful and `false` otherwise

#### Example

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};
const double = n => n;

update(obj, 'a.b.c', double); // { a: { b: { c: 2, d: 2 } } }
update(obj, 'a.b.c.d', double); // { a: { b: { c: 2, d: 2 } } }
```

### `del(object, path)`

Recurses down an object and deletes the property at the given path.

#### Arguments

-   `object` _{Object}_: The object to traverse
-   `path` _{string | number | symbol | Array<string | number | symbol>}_: The path by which to traverse the object

#### Returns

-   _{boolean}_: `true` if the deletion was successful and `false` otherwise

#### Example

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};

del(obj, 'a.b.c'); // { a: { b: { d: 2 } } }
```

### `has(object, path)`

Recurses down an object and checks to make sure something exists at the end of the path. The value at the end does not matter; only the existence of the final key is checked.

#### Arguments

-   `object` _{Object}_: The object to traverse
-   `path` _{string | number | symbol | Array<string | number | symbol>}_: The path by which to traverse the object

#### Returns

-   _{boolean}_: `true` if the path resolves and `false` otherwise

#### Example

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};

has(obj, 'a.b.c'); // true
has(obj, 'a.b.c.d'); // false
```

### `generate(value, path)`

Given a value and a path, generates a series of nested objects that terminate with the supplied value.

#### Arguments

-   `value` _{\*}_: The value to set at the end of the path
-   `path` _{string | number | symbol | Array<string | number | symbol>}_: The path down which the value should be set

#### Returns

-   _{Object}_: A nested object which terminates at the value

#### Example

```js
generate(1, 'a.b.c'); // { a: { b: { c: 1 } } }
```

### `merge(target, source, onCollision?)`

Deeply merges two objects together. The following method is used in case there is a key collision between the two objects being merged:

-   if the values of both are objects, continue merging
-   if either one of the values are not objects, pass both into the `onCollision` function

By default, `merge` will override the left object's value with the value on the object being merged into it (similar to `Object.assign`). This can be configured.

The function signature for `onCollision` is

```
(leftObj, rightObj, key) => any
```

where `leftObj` is the current object being merged into (not necessarily the original object passed as the first parameter to `merge`), `rightObj` is the current object being merged (again, not necessarily the second parameter passed into `merge`), and `key` is the key these two objects have in common.

#### Arguments

-   `target` _{Object}_: The object being merged into
-   `source` _{Object}_: The object being merged
-   `onCollision` _{Function(Object, Object, string | symbol): \*}_: The function used to determing merge conflicts

#### Returns

-   _{Object}_: The result of the merge operation

#### Example

```js
const left = {
    a: {
        b: 1,
    },
};
const right = {
    a: {
        b: 2,
        c: 3,
    },
};
const onCollision = (left, right, key) => [left[key], right[key]];

merge(left, right); // { a: { b: 2, c: 3 } }
merge(left, right, onCollision); // { a: { b: [1, 2], c: 3 } }
```

### `destructure(object, shouldTraverse)`

Will take an object and flatten it into an object of paths and values as the key/value pairs. Any time the function could recurse farther down an object, it calls a configurable `shouldTraverse` parameter to check if it should.

The function signature for `shouldTraverse` is

```
(value, key, obj) => boolean
```

where `value` is the object to potentially traverse into, `key` is its respective key, and `obj` is the object passed into the `destructure` call.

#### Arguments

-   `object` _{Object}_: The object to traverse
-   `shouldTraverse` _{Function(\*, string | symbol, Object): boolean}_: The path down which the value should be set

#### Returns

-   _{Object}_: A flat object of period-separated paths as keys, and their respective terminal values

#### Example

```js
const obj = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};
const onlyOneKey = obj => Object.keys(obj).length === 1;

destructure(obj); // { 'a.b.c': 1, 'a.b.d': 2 }
destructure(obj, onlyOneKey); // { 'a.b': { c: 1, d: 2 } }
```

### `contains(object, subObject)`

Checks if one object deeply contains another.

#### Arguments

-   `object` _{Object}_: The main objct
-   `subObject` _{Object}_: The object to check if it is contained in `object`

#### Returns

-   _{boolean}_: `true` for containment, `false` otherwise

#### Example

```js
const obj1 = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};
const obj2 = { b: { c: 1 } };
const obj3 = { c: 2, d: 2 };

contains(obj1, obj2); // true
contains(obj1, obj3); // false
```

### `equals(object1, object2)`

Checks if two objects deeply equal each other.

#### Arguments

-   `object1` _{Object}_: An object to check for equality with `object2`
-   `object2` _{Object}_: An object to check for equality with `object1`

#### Returns

-   _{boolean}_: `true` for equality, `false` otherwise

#### Example

```js
const obj1 = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};
const obj2 = {
    a: {
        b: {
            c: 1,
            d: 2,
        },
    },
};
const obj3 = {
    a: {
        b: 5,
    },
};

equals(obj1, obj2); // true
equals(obj1, obj3); // false
```

### `keys(object)`

Returns all own (enumerable and non-enumerable) keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<string | symbol>}_: Array of all own keys in the object

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
keys(obj); // [ 'a', 'b', Symbol() ]
```

### `keys.enum(object)`

Returns all own enumerable keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<string>}_: Array of all own enumerable keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
keys.enum(obj); // [ 'a', 'b' ]
```

### `keys.names(object)`

Returns all own string (enumerable and non-enumerable) keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<string>}_: Array of all own string keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
keys.names(obj); // [ 'a', 'b' ]
```

### `keys.symbols(object)`

Returns all own enumerable keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<symbol>}_: Array of all own symbol keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
keys.symbol(obj); // [ Symbol() ]
```

### `values(object)`

Returns all values for own (enumerable and non-enumerable) keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<\*>}_: Array of all own values in the object

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
values(obj); // [ 1, 2, 3 ]
```

### `values.enum(object)`

Returns all values for own enumerable keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<\*>}_: Array of all own enumerable values

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
values.enum(obj); // [ 1, 2 ]
```

### `values.names(object)`

Returns values for all own string (enumerable and non-enumerable) keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<\*>}_: Array of values for all own string keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
values.names(obj); // [ 1, 2 ]
```

### `values.symbols(object)`

Returns values for all own enumerable keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<\*>}_: Array of values for all own symbol keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
values.symbol(obj); // [ 3 ]
```

### `entries(object)`

Returns all entries for own (enumerable and non-enumerable) keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<[string | symbol, *]>}_: Array of all own entries in the object

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
entries(obj); // [ [ 'a', 1] , [ 'b', 2 ], [ Symbol(), 3 ] ]
```

### `entries.enum(object)`

Returns all entries for own enumerable keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<[string, *]>}_: Array of all own enumerable entries

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
entries.enum(obj); // [ [ 'a', 1 ], [ 'b', 2 ] ]
```

### `entries.names(object)`

Returns entries for all own string (enumerable and non-enumerable) keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<[string, *]>}_: Array of entries for all own string keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
entries.names(obj); // [ [ 'a', 1 ], [ 'b', 2 ] ]
```

### `entries.symbols(object)`

Returns entries for all own enumerable keys of a specified object.

#### Arguments

-   `object` _{Object}_: The object whose keys should be extracted

#### Returns

-   _{Array<[symbol, *]>}_: Array of entries for all own symbol keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    [Symbol()]: 3,
};
entries.symbol(obj); // [ [ Symbol(), 3 ] ]
```

### `fromEntries(entries)`

Takes an array of `[key, value]` tuples and constructs an object out of them. Works identically to `Object.fromEntries`.

#### Arguments

-   `entries` _{Array<[string | symbol | number, *]>}_: Array of entries for the object

#### Returns

-   _{Object}_: An object built from the key/value pairs

#### Example

```js
const entries = [
    ['key1', 1],
    ['key2', 2],
];
const object = fromEntries(entries); // { key1: 1, key2: 2 }
```

### `map(object, mapFn)`

Takes an object and a function and manipulates its `[key, value]` pairs.

The function signature for `mapFn` is

```
(key, value, obj) => [newKey, newValue]
```

where `key` and `value` are the current key/value pairs to change, `obj` is the original object, and `[newKey, newValue]` is a tuple of what the new entry should be.

#### Arguments

-   `object` _{Object}_: The object to change
-   `mapFn` _{Function(string | symbol, \*, Object): [ string | number | symbol, \*]}_: The mapping function

#### Returns

-   _{Object}_: The updated object

#### Example

```js
const obj = {
    a: 1,
    b: 2,
};
const tag = (key, value, object) => [key + value, value * 2];
map(obj, tag); // { a1: 2, b2: 4 }
```

### `mapKeys(object, mapFn)`

Takes an object and a function and manipulates its keys.

The function signature for `mapFn` is

```
(key, value, obj) => newKey
```

where `key` and `value` are the current key/value pairs to change, `obj` is the original object, and `newKey` is the new key to use for that value.

#### Arguments

-   `object` _{Object}_: The object to change
-   `mapFn` _{Function(string | symbol, \*, Object): string | number | symbol}_: The mapping function

#### Returns

-   _{Object}_: The object with updated keys

#### Example

```js
const obj = {
    a: 1,
    b: 2,
};
const tag = (key, value, object) => key + key;
mapKeys(obj, tag); // { aa: 1, bb: 2 }
```

### `mapValues(object, mapFn)`

Takes an object and a function and manipulates its values.
The function signature for `mapFn` is

```
(value, key, obj) => newValue
```

where `value` and `key` are the current key/value pairs to change, `obj` is the original object, and `newValue` is the new value to use with that key.

#### Arguments

-   `object` _{Object}_: The object to change
-   `mapFn` _{Function(*, string | symbol, Object): *}_: The mapping function

#### Returns

-   _{Object}_: The object with updated values

#### Example

```js
const obj = {
    a: 1,
    b: 2,
};
const double = (value, key, object) => value * 2;
mapValues(obj, double); // { a: 2, b: 4 }
```

### `find(object, findFn)`

Given an object and a function, returns the first `[key, value]` pair that results in a truthy value.

The function signature for `findFn` is:

```
(key, value, obj) => boolean
```

where `key` and `value` are the current key/value pairs to inspect and `obj` is the original object.

#### Arguments

-   `object` _{Object}_: The object to change
-   `findFn` _{Function(string | symbol, \*, Object): boolean}_: The finding function

#### Returns

-   _{[string | symbol, *]}_: The first `[key, value]` tuple for which `findFn` returned a truthy value

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    c: 3,
};
const findEvenValue = ([key, value]) => value % 2 === 0;
find(obj, findEvenValue); // [ 'b', 2 ]
```

### `findKey(object, findFn)`

Given an object and a function, returns the first key that results in a truthy value.

The function signature for `findFn` is the same as `find()`.

#### Arguments

-   `object` _{Object}_: The object to change
-   `findFn` _{Function(string | symbol, \*, Object): boolean}_: The finding function

#### Returns

-   _{string | symbol}_: The first key for which `findFn` returned a truthy value

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    c: 3,
};
const findEvenValue = ([key, value]) => value % 2 === 0;
findKey(obj, findEvenValue); // 'a'
```

### `findValue(object, findFn)`

Given an object and a function, returns the first value that results in a truthy value.

The function signature for `findFn` is the same as `find()`.

#### Arguments

-   `object` _{Object}_: The object to change
-   `findFn` _{Function(string | symbol, \*, Object): boolean}_: The finding function

#### Returns

-   _{\*}_: The first value for which `findFn` returned a truthy value

#### Example

```js
const obj = {
    a: 1,
    b: 2,
    c: 3,
};
const findEvenValue = ([key, value]) => value % 2 === 0;
findValue(obj, findEvenValue); // 2
```

## License

Objectivze is licensed under the MIT license.
