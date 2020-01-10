import { types, isOneOf, isArrayOf } from 'tupos';
import { normalizeParams, ensureParams } from './decorators';

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
    $FLOAT64ARRAY,
} = types;

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

/**
 * Checks of all arguments are objects.
 *
 * @param  {...any} values
 * @returns {boolean}
 */
const areObjects = (...values) => values.every($OBJECT);

/**
 * Checks if an argument represents a valid object path.
 *
 * Possible paths are either arrays of string/number/symbol values
 * or individual strings, numbers, or symbols.
 *
 * @param {*}
 * @returns {boolean}
 */
const isValidPath = isOneOf(
    isArrayOf($STRING, $NUMBER, $SYMBOL),
    $STRING,
    $NUMBER,
    $SYMBOL
);

/**
 * Recursively traverses an object and returns the value found at the end of a path.
 *
 * This function assumes that `path` is normalized as an array of numbers, strings, and
 * symbols.
 *
 * @param {Object} obj
 * @param {Array<string | number | symbol>} path
 * @returns {any}
 */
const _get = (obj, path) => {
    if (path.length === 0) return obj;
    if (!isKeyed(obj)) return undefined;

    return _get(obj[path[0]], path.slice(1));
};

/**
 * Recursively traverses an object and sets `val` at the end of the specified path.
 *
 * This function assumes that `path` has been normalized to be an array of strings,
 * numbers, and symbols. Returns `true` if set has successful and `false` otherwise.
 *
 * @param {Object} obj
 * @param {Array<string | number | symbol>} path
 * @param {*} val
 * @returns {boolean}
 */
const _set = (obj, path, val) => {
    if (!isKeyed(obj)) return false;

    if (!Reflect.has(obj, path[0])) obj[path[0]] = {};

    if (path.length === 1) {
        obj[path[0]] = val;
        return true;
    }

    return _set(obj[path[0]], path.slice(1), val);
};

/**
 * Recursively traverses an object and deletes a key at the specified path.
 *
 * Assumes that `path` has been normalized to be an array of strings, numbers,
 * and symbols. Returns `true` if deletion was successful and `false` otherwise.
 * @param {Object} obj
 * @param {Array<string | number | symbol>} path
 * @returns {boolean}
 */
const _delete = (obj, path) => {
    if (!isKeyed(obj)) return false;

    if (path.length === 1) {
        delete obj[path[0]];
        return true;
    }

    return _delete(obj[path[0]], path.slice(1));
};

/**
 * Recursively traverses an object and checks for the existence of a key at a
 * specified path.
 *
 * Assumes `path` has been normalized to be an array of strings, numbers, and
 * symbols. Returns `true` if something exists, and `false` otherwise.
 *
 * @param {Object} obj
 * @param {Array<string | number | path>} path
 * @returns {boolean}
 */
const _has = (obj, path) => {
    if (!isKeyed(obj)) return false;

    if (path.length === 1) {
        return Reflect.has(obj, path[0]);
    }

    return _has(obj[path[0]], path.slice(1));
};

/**
 * Simulates `Object.assign` for merging the second object's value onto the
 * primary objects value. Used in the `merge` function.
 *
 * @param {Object} retObj
 * @param {Object} subObj
 * @param {string | number | symbol} key
 * @returns {*}
 */
const mergeCollision = (retObj, subObj, key) => subObj[key];

/**
 * Composes multiple functions together into one.
 *
 * The order of function execution is right-most function to left-most function.
 *
 * @param  {...Function} fns
 * @returns {Function}
 */
const compose = (...fns) => fns.reduce((acc, fn) => fn(acc));

/**
 * A function used in `ensureParams` to require its position exists but to always
 * validate a `true`.
 *
 * @returns {true}
 */
const exists = () => true;

/**
 * Used to normalize a valid path to be array based.
 *
 * All strings are split by periods, numbers and symbols are made into one-element
 * arrays. All else are returned as-is. In order for this last return to work, it
 * assumes that `path` has already been validated with `isValidPath()`.
 *
 * @param {string | number | symbol | Array<string | number | symbol>} path
 * @returns {Array<string | number | symbol>}
 */
const convertPathsToArray = path => {
    if ($STRING(path)) {
        return path.split('.');
    }

    if ($NUMBER(path) || $SYMBOL(path)) {
        return [path];
    }

    return path;
};

/**
 * A decorator function for normalizing all parameters for traversal-based
 * functions, such as `get()` or `set()`.
 *
 * @param {Function}
 * @returns {Function}
 */
const normalizePaths = normalizeParams(
    x => x,
    convertPathsToArray,
    x => x
);

/**
 * A decorator function to guarantee that a function receives an [ object, valid-path ]
 * argument signature.
 *
 * @param {Function}
 * @returns {Function}
 */
const hasObjectAndPath = ensureParams(() => undefined, isKeyed, isValidPath);

/**
 * A decorator function to guarantee that a function receives an [ object, valid-path, any ]
 * argument signature.
 * @param {Function}
 * @returns {Function}
 */
const hasObjectPathAndValue = ensureParams(
    () => false,
    isKeyed,
    isValidPath,
    exists
);

export {
    compose,
    isKeyed,
    areObjects,
    isValidPath,
    _get,
    _set,
    _delete,
    _has,
    mergeCollision,
    convertPathsToArray,
    normalizePaths,
    hasObjectAndPath,
    hasObjectPathAndValue,
};
