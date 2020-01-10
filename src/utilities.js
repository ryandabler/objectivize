const { types, isOneOf, isArrayOf } = require('tupos');
const {
    $OBJECT,
    $STRING,
    $NUMBER,
    $SYMBOL,
    $ARRAY,
    $INT8ARRAY,
    $UINT8ARRAY,
    $UINT8CLAMPEDARRAY,
    $INT16ARRAY,
    $UINT16ARRAY,
    $INT32ARRAY,
    $UINT32ARRAY,
    $FLOAT32ARRAY,
    $FLOAT64ARRAY
} = types;
const { normalizeParams, ensureParams } = require('./decorators');

/**
* Checks if an item has a type specified in the list.
* 
* @param {*} - Item to type check against
* @returns {boolean}
*/
const isKeyed = isOneOf(
    $OBJECT,
    $ARRAY,
    $INT8ARRAY,
    $UINT8ARRAY,
    $UINT8CLAMPEDARRAY,
    $INT16ARRAY,
    $UINT16ARRAY,
    $INT32ARRAY,
    $UINT32ARRAY,
    $FLOAT32ARRAY,
    $FLOAT64ARRAY
);

const areObjects = (...values) => values.every($OBJECT);

const isValidPath = isOneOf(isArrayOf($STRING, $NUMBER, $SYMBOL), $STRING, $NUMBER, $SYMBOL);

const _get = (obj, path) => {
    if (path.length === 0) return obj;
    if (!isKeyed(obj)) return undefined;

    return _get(obj[path[0]], path.slice(1));
};

const _set = (obj, path, val) => { 
    if (!isKeyed(obj)) return false;

    if (!Reflect.has(obj, path[0])) obj[path[0]] = {};

    if (path.length === 1) {
        obj[path[0]] = val;
        return true;
    }

    return _set(obj[path[0]], path.slice(1), val);
};

const _delete = (obj, path) => { 
    if (!isKeyed(obj)) return false;

    if (path.length === 1) {
        delete obj[path[0]];
        return true;
    }

    return _delete(obj[path[0]], path.slice(1));
};

const _has = (obj, path) => {
    if (!isKeyed(obj)) return false;
    
    if (path.length === 1) {
        return Reflect.has(obj, path[0]);
    }

    return _has(obj[path[0]], path.slice(1));
};

const mergeCollision = (retObj, subObj, key) => subObj[key];

const compose = (...fns) => fns.reduce((acc, fn) => fn(acc));

const exists = () => true;
const convertPathsToArray = path => {
    if ($STRING(path)) {
        return path.split('.'); 
    }
    
    if ($NUMBER(path) || $SYMBOL(path)) {
        return [ path ];
    }

    return path;
};
const normalizePaths = normalizeParams(x => x, convertPathsToArray, x => x);
const hasObjectAndPath = ensureParams(() => undefined, isKeyed, isValidPath);
const hasObjectPathAndValue = ensureParams(() => false, isKeyed, isValidPath, exists);

module.exports = { compose, isKeyed, areObjects, isValidPath, _get, _set, _delete, _has, mergeCollision, convertPathsToArray, normalizePaths, hasObjectAndPath, hasObjectPathAndValue };