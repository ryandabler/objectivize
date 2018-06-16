const { types, typeOf } = require("tupos");

const identity = item => item

const duplicateFunction = func => Function("return " + func)()

const duplicateError = err => {
    const newErr = new Error(err.message);
    newErr.name = err.name;
    return newErr;
}

const duplicateRegExp = regex => new RegExp(regex.source, regex.flags)

const duplicateDate = dt => new Date(dt)

const duplicateObject = obj => {
    const retObj = {};

    for (const key in obj) {
        retObj[key] = duplicate[typeOf(obj[key])](obj[key]);
    }

    return retObj;
}

const duplicateArray = arr => {
    const retArr = [];
    for (const key in arr) {
        retArr[key] = arr[key];
    }

    return retArr;
}

const duplicateMapType = constructor => map => new constructor(map)

const duplicateSetType = constructor => set => new constructor(set)

const duplicatePromise = promise => promise.then()

const duplicate = {
    [types.STRING]: identity,
    [types.NUMBER]: identity,
    [types.BOOLEAN]: identity,
    [types.NULL]: identity,
    [types.UNDEFINED]: identity,
    [types.SYMBOL]: identity,
    [types.FUNCTION]: duplicateFunction,
    [types.ERROR]: duplicateError,
    [types.REGEXP]: duplicateRegExp,
    [types.DATE]: duplicateDate,
    [types.OBJECT]: duplicateObject,
    [types.ARRAY]: duplicateArray,
    [types.MAP]: duplicateMapType(Map),
    [types.WEAKMAP]: duplicateMapType(WeakMap),
    [types.SET]: duplicateSetType(Set),
    [types.WEAKSET]: duplicateSetType(WeakSet),
    [types.MATH]: identity,
    [types.PROMISE]: duplicatePromise
}