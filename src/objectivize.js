"use strict";

const { types, typeOf } = require("tupos");

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
* Creates a nested object whose keys are the specified path, terminating at the value.
* 
* @param {*} val Value to be inserted into object
* @param {string} path Specified path to the value
* @returns {Object}
*/
const resolvePathAndSet = (val, path) => {
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
* Traverses the main object, ensuring that the key in subObj is
* in mainObj, and recursively merging the next layer of each object.
* When a key is found in subObj that isn't in mainObj, the two 
* can be safely merged and the merged object is returned.
* 
* @param {Object} mainObj Object to have other object merged into
* @param {Object} subObj Object being merged
* @returns {Object}
*/
const mergeObjects = (mainObj, subObj) => {
    let retObj = { ...mainObj };
    for (const key in subObj) {
        if (key in mainObj) {
            retObj[key] = mergeObjects(mainObj[key], subObj[key]);
        } else {
            retObj = { ...retObj, [key]: subObj[key] };
        }
    }
    return retObj;
}

/**
* Traverses an object and flattens it.
* 
* Takes an object of arbitrary nestedness recursively traverses each path to
* generate a string representation of the path all the way down to the actual
* value. This path then gets added to a new object as key, with the indicated
* value as the value.
* 
* @param {Object} obj Object to flatten
* @param {string} [path=null] Path variable to track the recursive depth
* @returns {Object}
*/
const destructure = (obj, path = null) => {
    let retObj = {};
    const entries = Object.entries(obj);

    entries.forEach(entry => {
        const [ key, val ] = entry;
        const currentPath = path ? path + "." + key : key;
        const subEntries = typeOf(val) === types.OBJECT ? destructure(val, currentPath) : null;
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
// TODO: Make this a deep copy. Issue #9
const copyObject = obj => {
    const paths = destructure(obj);
    let retObj = {};
    for (const path in paths) {
        retObj = mergeObjects(
            retObj,
            resolvePathAndSet(resolvePathAndGet(obj, path), path)
        );
    }

    return retObj;
}