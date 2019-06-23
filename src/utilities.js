const { types, isOneOf, are } = require('tupos');

/**
* Checks if an item has a type specified in the list.
* 
* @param {*} - Item to type check against
* @returns {boolean}
*/
const isKeyed = isOneOf(
    types.OBJECT,
    types.ARRAY,
    types.INT8ARRAY,
    types.UINT8ARRAY,
    types.UINT8CLAMPEDARRAY,
    types.INT16ARRAY,
    types.UINT16ARRAY,
    types.INT32ARRAY,
    types.UINT32ARRAY,
    types.FLOAT32ARRAY,
    types.FLOAT64ARRAY
);

const areObjects = are(types.OBJECT);
const isValidPath = isOneOf(types.ARRAY, types.STRING);

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

const _has = (obj, path) => {
    if (!isKeyed(obj)) return false;
    
    if (path.length === 1) {
        return Reflect.has(obj, path[0]);
    }

    return _has(obj[path[0]], path.slice(1));
}

module.exports = { isKeyed, areObjects, isValidPath, _get, _set, _has };