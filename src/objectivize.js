'use strict';

import { compose, isKeyed, areObjects, _get, _set, _delete, _has, mergeCollision, normalizePaths, hasObjectAndPath, hasObjectPathAndValue } from './utilities';

/**
 * Retrieves the value from a nested object given a path.
 * 
 * Iterates over an array containing the path to traverse in obj to find the value.
 * The value of each step in the path should be an object except for the final stage.
 * If any other step is not an object, should return undefined.
 * 
 * @param {Object} obj Object to retrieve value from
 * @param {Array<string | number | symbol> | string} path Path to desired value
 * @returns {*}
 */
const get = compose(_get, normalizePaths, hasObjectAndPath);

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
 * @returns {boolean}
 */
const set = compose(_set, normalizePaths, hasObjectPathAndValue);

/**
 * Update a deeply nested portion of an object.
 * 
 * Will extract the portion of an object to be updated. If none exists,
 * it will return the object unchanged. Otherwise it will update that
 * portion and return the object.
 * 
 * @param {Object} obj Object to update some portion of sub-tree
 * @param {string} path Path leading to part to update
 * @param {Function} updateFn Updates the value
 * @returns {boolean}
 */
const update = compose(
    (obj, path, updateFn) => {
        const updatable = get(obj, path);
        if (!updatable) return false;
    
        const updatedItem = updateFn(updatable);
        return set(obj, path, updatedItem);
    },
    normalizePaths
);

/**
 * Deletes the value from a nested object given a path.
 * 
 * Iterates over an array containing the path to traverse in `obj` to find the value.
 * The value of each step in the path should be an object except for the final stage.
 * If any other step is not an object, should return `false`. Returns `true` if 
 * property was successfully deleted.
 * 
 * @param {Object} obj Object to retrieve value from
 * @param {Array<string | number | symbol> | string} path Path to desired value
 * @returns {*}
 */
const del = compose(_delete, normalizePaths, hasObjectAndPath);

/**
 * Check if an object has a particular path
 * 
 * Will recurse down a supplied path of an object to check if it exists.
 * 
 * @param {Object} obj Object to update some portion of sub-tree
 * @param {string} path Path leading to part to update
 * @returns {boolean}
 */
const has = compose(_has, normalizePaths, hasObjectAndPath);

/**
 * Creates a nested object whose keys are the specified path, terminating at the value.
 * 
 * @param {*} val Value to be inserted into object
 * @param {string} path Specified path to the value
 * @returns {Object}
 */
const generate = (val, path) => {
    const retObj = {};
    let pointer = retObj;

    path.split('.').forEach((_path, idx, arr) => {
        pointer[_path] = idx === arr.length - 1 ? val : {};
        pointer = pointer[_path];
    });

    return retObj;
};

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
const merge = (mainObj, subObj, onCollision = mergeCollision) => {
    let retObj = { ...mainObj };
    for (const key in subObj) {
        if (key in retObj && areObjects(retObj[key], subObj[key])) {
            retObj[key] = merge(retObj[key], subObj[key]);
        } else if (key in retObj) {
            retObj[key] = onCollision(retObj, subObj, key);
        } else {
            retObj = { ...retObj, [key]: subObj[key] };
        }
    }

    return retObj;
};

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
        const currentPath = path ? path + '.' + key : key;
        const subEntries =  isKeyed(val) && Object.keys(val).length > 0 && shouldTraverse(val, key, obj)
            ? destructure(val, currentPath, shouldTraverse)
            : null;
        retObj = subEntries ? { ...retObj, ...subEntries } : { ...retObj, [currentPath]: val };
    });

    return retObj;
};

/**
 * Checks if one object contains another.
 * 
 * Recursively traverses the structure of a given object to check if any
 * sub-structure in that object is identical in shape to another
 * 
 * @param {Object} obj Object to check for containment of another object
 * @param {Object} maybeSubset Object to check whether it is contained in given object
 * @returns {boolean}
 */
const contains = (obj, maybeSubset) => {
    if (!isKeyed(obj) || !isKeyed(maybeSubset)) return obj === maybeSubset;
    
    const objKeys = Object.keys(obj);
    const subsetKeys = Object.keys(maybeSubset);
    
    return subsetKeys.every( key => key in obj && contains(obj[key], maybeSubset[key]) ) || objKeys.some( key => contains(obj[key], maybeSubset) );
};

/**
 * Checks if to object are deeply equal.
 * 
 * Utilizes `contains` to check that each object is contained in the other,
 * which thereby guarantees equality.
 * 
 * @param {Object} obj1 Object to compare with other for equality
 * @param {Object} obj2 Object to compare with other for equality
 * @returns {boolean}
 */
const equals = (obj1, obj2) => contains(obj1, obj2) && contains(obj2, obj1);

export {
    get,
    set,
    update,
    del,
    has,
    generate,
    merge,
    destructure,
    contains,
    equals
};