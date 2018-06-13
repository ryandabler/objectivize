const { types, typeOf } = require("tupos");

const duplicateString = str => str

const duplicateNumber = num => num

const duplicateBoolean = bool => bool

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
    [types.DATE]: duplicateDate,
    [types.OBJECT]: duplicateObject,
    [types.ARRAY]: duplicateArray,
    [types.MAP]: duplicateMapType(Map),
    [types.WEAKMAP]: duplicateMapType(WeakMap),
    [types.SET]: duplicateSetType(Set),
    [types.WEAKSET]: duplicateSetType(WeakSet)
}