const { types, typeOf } = require("tupos");

const duplicateString = str => str

const duplicateNumber = num => num

const duplicateBoolean = bool => bool

const duplicateNull = nl => nl

const duplicateUndefined = undef => undef

const duplicateSymbol = symbol => symbol

const duplicateFunction = func => Function("return " + func)()

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
    return arr.map(item => duplicate[typeOf(item)](item));
}

const duplicateMapType = constructor => map => new constructor(map)

const duplicateSetType = constructor => set => new constructor(set)

const duplicate = {
    [types.STRING]: duplicateString,
    [types.NUMBER]: duplicateNumber,
    [types.BOOLEAN]: duplicateBoolean,
    [types.NULL]: duplicateNull,
    [types.UNDEFINED]: duplicateUndefined,
    [types.SYMBOL]: duplicateSymbol,
    [types.FUNCTION]: duplicateFunction,
    [types.REGEXP]: duplicateRegExp,
    [types.DATE]: duplicateDate,
    [types.OBJECT]: duplicateObject,
    [types.ARRAY]: duplicateArray,
    [types.MAP]: duplicateMapType(Map),
    [types.WEAKMAP]: duplicateMapType(WeakMap),
    [types.SET]: duplicateSetType(Set),
    [types.WEAKSET]: duplicateSetType(WeakSet)
}