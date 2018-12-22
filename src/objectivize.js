"use strict";

const { types, typeOf } = require("tupos");
const { isKeyed } = require('./utilities');

/**
* Retrieves the value from a nested object given a path.
* 
* Iterates over an array containing the path to traverse in obj to find the value.
* The value of each step in the path should be an object except for the final stage.
* If any other step is not an object, should return null.
* 
* @param {Object} obj Object to retrieve value from
* @param {string} path Period-separated path to desired value
* @returns {*}
*/
const resolvePathAndGet = (obj, path) => {
    const segments = path.split(".");
    let pointer = obj;
    const validTypes = [ types.OBJECT, types.ARRAY ];

    while (validTypes.includes(typeOf(pointer)) && segments.length > 0) {
        const segment = segments.shift();
        pointer = pointer[segment];
    }

    return segments.length === 0 ? pointer : null;
}

/**
* Set the value in a nested object given a path.
* 
* Iterates over an array containing the path to traverse in obj to find the value.
* The value of each step in the path should be an object to allow continued traversal.
* If at any point along the way, a segment of path can't be resolved, an object
* from the remaining segments will be created and appended to the obj param.
* 
* @param {Object} obj Object to retrieve value from
* @param {string} path Period-separated path to desired value
* @param {*} val New value to set
* @returns {Object}
*/
const resolvePathAndSet = (obj, path, val) => {
    const segments = path.split(".");
    let pointer = obj;
    const validTypes = [ types.OBJECT, types.ARRAY ];

    while (validTypes.includes(typeOf(pointer)) && segments.length > 1) {
        const segment = segments.shift();

        if (segment in pointer) pointer = pointer[segment];
        else {
            pointer[segment] = generateObjectFromPath(val, segments.join('.'));
            return obj;
        }
    }
    const segment = segments.shift();
    pointer[segment] = val;
    
    return obj;
}

/**
* Creates a nested object whose keys are the specified path, terminating at the value.
* 
* @param {*} val Value to be inserted into object
* @param {string} path Specified path to the value
* @returns {Object}
*/
const generateObjectFromPath = (val, path) => {
    const retObj = {};
    let pointer = retObj;

    path.split(".").forEach((_path, idx, arr) => {
        pointer[_path] = idx === arr.length - 1 ? val : {};
        pointer = pointer[_path];
    });

    return retObj;
}

/**
* Merges an object of arbitrary depth into another object.
* 
* Traverses the keys in subObj, ensuring that each one is
* in mainObj, and recursively merging the next layer of each object.
* If both objects have the same path, the values will be merged into
* an array. When a key is found in subObj that isn't in mainObj, the two 
* can be safely merged and the merged object is returned.
* 
* @param {Object} mainObj Object to have other object merged into
* @param {Object} subObj Object being merged
* @returns {Object}
*/
//TODO: should deep copy mainObj rather than use spread syntax. Issue #3
var mergeObjects = (mainObj, subObj) => {
    let retObj = { ...mainObj };
    for (const key in subObj) {
        if (key in retObj &&
            typeOf(retObj[key]) === types.OBJECT &&
            typeOf(subObj[key]) === types.OBJECT
        ) {
            retObj[key] = mergeObjects(retObj[key], subObj[key]);
        } else if (key in retObj && typeOf(retObj[key]) === types.ARRAY) {
            retObj[key] = retObj[key].concat(subObj[key]);
        } else if (key in retObj) {
            retObj[key] = [ retObj[key], subObj[key] ];
        } else {
            retObj = { ...retObj, [key]: subObj[key] };
        }
    }

    return retObj;
}

/**
* Traverses an object and flattens it.
* 
* Takes an object of arbitrary nestedness and recursively traverses each path to
* generate a string representation of the path all the way down to the actual
* value. It will perform a check to make sure that the value should be recursed
* by taking in the current value, key, and object (in that order). This path then
* gets added to a new object as key, with the indicated value as the value.
* 
* @param {Object} obj Object to flatten
* @param {string} [path=null] Path variable to track the recursive depth
* @param {Function} [shouldTraverse=() => true] Function that checks whether a keyed object should be destructured
* @returns {Object}
*/
const destructure = (obj, path = null, shouldTraverse = () => true) => {
    let retObj = {};
    const entries = Object.entries(obj);

    entries.forEach(entry => {
        const [ key, val ] = entry;
        const currentPath = path ? path + "." + key : key;
        const subEntries =  isKeyed(val) && Object.keys(val).length > 0 && shouldTraverse(val, key, obj)
            ? destructure(val, currentPath, shouldTraverse)
            : null;
        retObj = subEntries ? { ...retObj, ...subEntries } : { ...retObj, [currentPath]: val };
    });

    return retObj;
}

/**
 * Takes an object and returns a copy of it
 * 
 * Destructures the object into its component paths, and creates a new object from
 * that path with the final value being the original value. Merges this new object
 * into the object that will finally be returned to the user.
 * 
 * @param {Object} obj Object to be copied
 */
// TODO: Make this a deep copy. Issue #1
const copyObject = obj => {
    const paths = destructure(obj);
    let retObj = {};
    for (const path in paths) {
        retObj = mergeObjects(
            retObj,
            generateObjectFromPath(resolvePathAndGet(obj, path), path)
        );
    }

    return retObj;
}

const deepEquals = (obj1, obj2) => {
    let equals = typeOf(obj1) === typeOf(obj2) && (["[object Number]"].includes(typeOf(obj1)) ? obj1 === obj2 : true);
    if (!equals) return false;

    for (const key in obj1) {
        if ( !(key in obj2) ) return false;
        equals = equals && typeOf(obj1[key]) === typeOf(obj2[key]) && deepEquals(obj1[key], obj2[key]);
        if (!equals) return false;
    }
    
    for (const key in obj2) {
        if ( !(key in obj1) ) return false;
        equals = equals && typeOf(obj2[key]) === typeOf(obj1[key]) && deepEquals(obj2[key], obj1[key]);
        if (!equals) return false;
    }
    
    return true;
}

module.exports = {
    resolvePathAndGet,
    resolvePathAndSet,
    generateObjectFromPath,
    mergeObjects,
    destructure,
    copyObject,
    deepEquals
};