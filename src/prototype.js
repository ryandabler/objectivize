/**
 * Obtains all keys from an object.
 * 
 * Will return all enumerable and non-enumerable keys, including symbols.
 * 
 * @param {Object} obj Object to get keys of
 * @returns {Array<string | symbol>}
 */
const keys = obj => [ ...keys.names(obj), ...keys.symbols(obj) ];

/**
 * Obtains all enumerable keys from an object.
 * 
 * @param {Object} obj Object to get keys of
 * @returns {Array<string | symbol>}
 */
keys.enum = Object.keys;

/**
 * Obtains all string keys from an object.
 * 
 * @param {Object} obj Object to get keys of
 * @returns {Array<string | symbol>}
 */
keys.names = Object.getOwnPropertyNames;

/**
 * Obtains all symbol keys from an object.
 * 
 * @param {Object} obj Object to get keys of
 * @returns {Array<string | symbol>}
 */
keys.symbols = Object.getOwnPropertySymbols;

/**
 * Obtains all values from an object.
 * 
 * Will return values for all enumerable and non-enumerable keys.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
const values = obj => keys(obj).map(key => obj[key]);

/**
 * Obtains values for all enumerable keys from an object.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
values.enum = obj => keys.enum(obj).map(key => obj[key]);

/**
 * Obtains values for all string keys from an object.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
values.names = obj => keys.names(obj).map(key => obj[key]);

/**
 * Obtains values for all symbol keys from an object.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
values.symbols = obj => keys.symbols(obj).map(key => obj[key]);

/**
 * Obtains all values from an object.
 * 
 * Will return [ key, value ] pairs for all enumerable and non-enumerable keys.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
const entries = obj => keys(obj).map(key => [ key, obj[key] ]);

/**
 * Obtains [ key, value ] for all enumerable keys from an object.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
entries.enum = obj => keys.enum(obj).map(key => [ key, obj[key] ]);

/**
 * Obtains [ key, value ] for all string keys from an object.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
entries.names = obj => keys.names(obj).map(key => [ key, obj[key] ]);

/**
 * Obtains [ key, value ] for all symbol keys from an object.
 * 
 * @param {Object} obj Object to get values of
 * @returns {Array<any>}
 */
entries.symbols = obj => keys.symbols(obj).map(key => [ key, obj[key] ]);

// Prepare for exports
const __keys = Object.freeze(keys);
const __values = Object.freeze(values);
const __entries = Object.freeze(entries);

export {
    __keys as keys,
    __values as values,
    __entries as entries
};