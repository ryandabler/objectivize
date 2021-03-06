////////////////////////////
// Initialize
////////////////////////////
import { expect } from 'chai';
import sinon from 'sinon';
import { types } from 'tupos';
import {
    get,
    set,
    update,
    del,
    has,
    generate,
    merge,
    destructure,
    contains,
    equals,
    fromEntries,
    map,
    mapKeys,
    mapValues,
    find,
    findKey,
    findValue,
} from '../src/objectivize';
import { keys, values, entries } from '../src/prototype';

const { $ARRAY, $OBJECT } = types;

////////////////////////////
// Test
////////////////////////////
describe('objectivize.js', function() {
    describe('get()', function() {
        it('Should get property in object', function() {
            const obj = {
                a: {
                    b: {
                        c: [1, 2, 3],
                    },
                },
            };
            const path = 'a.b.c.1';
            const result = get(obj, path);
            expect(result).to.equal(obj.a.b.c[1]);
        });

        it('Should return the fallback value for non-existent path', function() {
            const obj = {
                a: {
                    b: {
                        c: [1, 2, 3],
                    },
                },
            };
            const fallback = Symbol('fallback');
            const path = 'a.b.d';
            const result = get(obj, path, fallback);
            expect(result).to.equal(fallback);
        });

        it('Should return the fallback value for bad parameters', function() {
            const params = [
                [undefined, 'a.b.c'],
                [{ a: { b: 2 } }, 1],
            ];
            const results = params.map(_params => get(..._params));
            expect(results.every(result => result === undefined)).to.be.true;
        });
    });

    describe('set()', function() {
        it('Should set a value in an existent path', function() {
            const obj = {
                a: {
                    b: {
                        c: [1, 2, 3],
                    },
                },
            };
            const path = 'a.b.c';
            const setValue = 1;
            const result = set(obj, path, setValue);
            const objectPaths = destructure(obj);

            expect(result).to.be.true;
            expect(Object.keys(objectPaths).length).to.equal(1);
            expect(obj.a.b.c).to.equal(setValue);
        });

        it('Should create non-existent paths during traversal', function() {
            const obj = {
                a: {
                    b: {
                        c: 1,
                    },
                },
            };
            const path = 'a.b.d.e';
            const setValue = 2;
            const result = set(obj, path, setValue);
            const resultPaths = destructure(obj);

            expect(result).to.be.true;
            expect(Object.keys(resultPaths).length).to.equal(2);
            expect(get(obj, path)).to.equal(setValue);
        });

        it('Should abort if trying to traverse an non-traversable type', function() {
            const obj = {
                a: {
                    b: {
                        c: 1,
                    },
                    d: 3,
                },
            };
            const path = 'a.d.e';
            const setValue = 3;
            const result = set(obj, path, setValue);
            const resultPaths = destructure(obj);

            expect(result).to.be.false;
            expect(Object.keys(resultPaths).length).to.equal(2);
            expect(get(obj, path)).to.equal(undefined);
        });
    });

    describe('update()', function() {
        it('Should return true if successfully updated', function() {
            const updateFn = arr => arr.concat(4);
            const obj = {
                a: {
                    b: {
                        c: [1, 2, 3],
                    },
                },
            };
            const path = 'a.b.c';
            const result = update(obj, path, updateFn);
            const objectPaths = destructure(obj);

            expect(Object.keys(objectPaths).length).to.equal(4);
            expect(result).to.be.true;
        });

        it("Should return false if update couldn't happen", function() {
            const updateFn = num => num + 1;
            const obj = {
                a: {
                    b: {
                        c: 1,
                    },
                },
            };
            const path = 'a.b.d.e';
            const result = update(obj, path, updateFn);
            const resultPaths = destructure(obj);

            expect(Object.keys(resultPaths).length).to.equal(1);
            expect(obj.a.b.c).to.equal(1);
            expect(result).to.be.false;
        });
    });

    describe('del()', function() {
        it('Should return true if successfully deleted', function() {
            const obj = {
                a: {
                    b: {
                        c: [1, 2, 3],
                    },
                },
            };
            const path = 'a.b.c';
            const result = del(obj, path);

            expect(has(obj, path)).to.be.false;
            expect(result).to.be.true;
        });

        it("Should return false if delete couldn't happen", function() {
            const obj = {
                a: {
                    b: {
                        c: 1,
                    },
                },
            };
            const path = 'a.b.d.e';
            const result = del(obj, path);
            const objPaths = destructure(obj);

            expect(obj.a.b.c).to.equal(1);
            expect(keys(objPaths).length).to.equal(1);
            expect(result).to.be.false;
        });
    });

    describe('has()', function() {
        it('Should return true if path exists', function() {
            const obj = {
                a: {
                    b: {
                        c: [1, 2, 3],
                    },
                },
            };
            const path = 'a.b.c.1';
            const result = has(obj, path);

            expect(result).to.be.true;
        });

        it("Should return false if path doesn't exist", function() {
            const obj = {
                a: {
                    b: {
                        c: 1,
                    },
                },
            };
            const path = 'a.b.d.e';
            const result = has(obj, path);

            expect(result).to.be.false;
        });
    });

    describe('generate()', function() {
        it('Should generate an object with a specified path terminating with a value', function() {
            const path = 'a.b.c';
            const value = 'test value';
            const result = generate(value, path);
            const resultPaths = destructure(result);

            expect(Object.keys(resultPaths).length).to.equal(1);
            expect(get(result, path)).to.equal(value);
        });
    });

    describe('merge()', function() {
        it('Should merge in shape as-is if no collisions ', function() {
            const mainObj = {
                a: 1,
                b: 2,
                e: {
                    f: 1,
                },
            };

            const subObject = {
                c: 3,
                d: {
                    e: 'abc',
                },
                e: {
                    g: 2,
                },
            };

            const result = merge(mainObj, subObject);
            const resultPaths = destructure(result);

            expect(contains(result, subObject)).to.be.true;
            expect(Object.keys(resultPaths).length).to.equal(6);
        });

        it("Should override first object's value with merged objects on key collision", function() {
            const mainObj = {
                a: 1,
                b: 2,
            };

            const subObject = {
                b: 3,
            };

            const finalObject = {
                a: 1,
                b: 3,
            };

            const result = merge(mainObj, subObject);

            expect(contains(result, finalObject)).to.be.true;
        });

        it('Should shallow merge objects', function() {
            const objectRef = {
                a: 1,
            };

            const mainObj = {
                b: {
                    d: 1,
                },
            };

            const subObj = {
                b: {
                    c: objectRef,
                },
            };

            const result = merge(mainObj, subObj);
            expect(result.b.c).to.equal(objectRef);
        });
    });

    describe('destructure()', function() {
        it('Should decompose an object into its component paths', function() {
            const paths = [
                ['a.b.c', 'path 1'],
                ['a.b.d', true],
                ['a.c.e.f.0', {}],
            ];
            const object = paths.reduce((obj, [path, val]) => {
                set(obj, path, val);
                return obj;
            }, {});

            const result = destructure(object);
            const resultPaths = Object.entries(result);
            expect(resultPaths.length).to.equal(paths.length);
            resultPaths.forEach(([path, val]) => {
                const [originalPath, originalVal] = paths.find(
                    ([_path]) => _path === path
                );
                expect(path).to.equal(originalPath);
                expect(val).to.equal(originalVal);
            });
        });

        it('Should account for a custom traversal', function() {
            const shouldTraverse = val => !$ARRAY(val);
            const paths = [
                ['a.b.c', ['path 1', 'path 2', 'path 3']],
                ['a.b.d', true],
                ['a.c.e.f.0', {}],
            ];
            const object = paths.reduce((obj, [path, val]) => {
                set(obj, path, val);
                return obj;
            }, {});

            const result = destructure(object, shouldTraverse);
            const resultPaths = Object.entries(result);
            expect(resultPaths.length).to.equal(paths.length);
            resultPaths.forEach(([path, val]) => {
                const [originalPath, originalVal] = paths.find(
                    ([_path]) => _path === path
                );
                expect(path).to.equal(originalPath);
                expect(val).to.equal(originalVal);
            });
        });
    });

    describe('contains()', function() {
        it('Should return true', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { d: 3 } },
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { c: 2 } },
                ],
            ];
            const results = objects.map(([obj, subObj]) =>
                contains(obj, subObj)
            );

            expect(results.every(result => result)).to.be.true;
        });

        it('Should return false', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { d: 4 } },
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { c: { d: 3 } } },
                ],
            ];
            const results = objects.map(([obj, subObj]) =>
                contains(obj, subObj)
            );

            expect(results.some(result => result)).to.be.false;
        });
    });

    describe('equals()', function() {
        it('Should return true', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { c: 2, d: 3 } },
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                ],
            ];
            const results = objects.map(([obj, subObj]) => equals(obj, subObj));

            expect(results.every(result => result)).to.be.true;
        });

        it('Should return false', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { d: 4 } },
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { a: 1, b: { c: 2, d: 4 } } },
                ],
            ];
            const results = objects.map(([obj, subObj]) => equals(obj, subObj));

            expect(results.some(result => result)).to.be.false;
        });
    });

    describe('fromEntries()', function() {
        it('Should build an object from an array of [key, value] pairs', function() {
            const entries = [
                ['key1', 1],
                ['key2', true],
                ['key3', { a: 1 }],
            ];
            const answer = {
                key1: 1,
                key2: true,
                key3: { a: 1 },
            };
            const result = fromEntries(entries);

            expect(result).to.deep.equal(answer);
        });
    });

    describe('map()', function() {
        it('Should return an object', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const mappedObj = map(obj, x => x);

            expect($OBJECT(mappedObj)).to.be.true;
        });

        it('Should call the mapping function on each [key, value, obj] tuple', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const _entries = entries(obj);
            const mapFn = sinon.fake.returns(['a', 1]);

            map(obj, mapFn);

            expect(mapFn.callCount).to.equal(_entries.length);
            _entries.forEach(([key, val]) => {
                expect(mapFn.calledWithExactly(key, val, obj)).to.be.true;
            });
        });
    });

    describe('mapKeys()', function() {
        it('Should return an object', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: {
                    a: 1,
                },
            };
            const mappedObj = map(obj, x => x);

            expect($OBJECT(mappedObj)).to.be.true;
        });

        it('Should call the mapping function on each key', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const _entries = entries(obj);
            const mapFn = sinon.fake.returns(['a', 1]);

            mapKeys(obj, mapFn);

            expect(mapFn.callCount).to.equal(_entries.length);
            _entries.forEach(([key, value]) => {
                expect(mapFn.calledWithExactly(key, value, obj)).to.be.true;
            });
        });
    });

    describe('mapValues()', function() {
        it('Should return an object', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: {
                    a: 1,
                },
            };
            const mappedObj = map(obj, x => x);

            expect($OBJECT(mappedObj)).to.be.true;
        });

        it('Should call the mapping function on each value', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const _entries = entries(obj);
            const mapFn = sinon.fake.returns(['a', 1]);

            mapValues(obj, mapFn);

            expect(mapFn.callCount).to.equal(_entries.length);
            _entries.forEach(([key, value]) => {
                expect(mapFn.calledWithExactly(value, key, obj)).to.be.true;
            });
        });
    });

    describe('find()', function() {
        it('Should call the findFn with each [key, value, object] pair', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const _entries = entries(obj);
            const findFn = sinon.fake.returns(false);
            find(obj, findFn);

            expect(findFn.callCount).to.equal(_entries.length);
            _entries.forEach(([key, value]) => {
                expect(findFn.calledWithExactly(key, value, obj)).to.be.true;
            });
        });

        it('Should return a [key, value] pair if found', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const findFn = () => true;
            const [key, value] = find(obj, findFn);

            expect(key in obj).to.be.true;
            expect(value).to.equal(obj[key]);
        });

        it('Should return `undefined` if nothing found', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const findFn = () => false;
            const entry = find(obj, findFn);

            expect(entry).to.be.undefined;
        });
    });

    describe('findKey()', function() {
        it('Should call the findFn with each [key, value, object] pair', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const _entries = entries(obj);
            const findFn = sinon.fake.returns(false);
            findKey(obj, findFn);

            expect(findFn.callCount).to.equal(_entries.length);
            _entries.forEach(([key, value]) => {
                expect(findFn.calledWithExactly(key, value, obj)).to.be.true;
            });
        });

        it('Should return a [key, value] pair if found', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const findFn = () => true;
            const key = findKey(obj, findFn);

            expect(key in obj).to.be.true;
        });

        it('Should return `undefined` if nothing found', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const findFn = () => false;
            const key = find(obj, findFn);

            expect(key).to.be.undefined;
        });
    });

    describe('findValue()', function() {
        it('Should call the findFn with each [key, value, object] pair', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const _entries = entries(obj);
            const findFn = sinon.fake.returns(false);
            findValue(obj, findFn);

            expect(findFn.callCount).to.equal(_entries.length);
            _entries.forEach(([key, value]) => {
                expect(findFn.calledWithExactly(key, value, obj)).to.be.true;
            });
        });

        it('Should return a value if found', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const findFn = () => true;
            const value = findValue(obj, findFn);

            const inObj = entries(obj).some(([, _value]) => _value === value);
            expect(inObj).to.be.true;
        });

        it('Should return `undefined` if nothing found', function() {
            const obj = {
                key1: 'a',
                key2: 1,
                key3: { a: 1 },
            };
            const findFn = () => false;
            const value = findValue(obj, findFn);

            expect(value).to.be.undefined;
        });
    });
});
