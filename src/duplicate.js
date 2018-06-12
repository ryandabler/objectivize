const { types, typeOf } = require("tupos");

const duplicateString = str => str

const duplicateNumber = num => num

const duplicateDate = dt => new Date(dt)

const duplicateObject = obj => {
    const retObj = {};

    for (const key in obj) {
        retObj[key] = duplicate[typeOf(obj[key])](obj[key]);
    }

    return retObj;
}

const duplicate = {
    [type.String]: duplicateString,
    [type.Number]: duplicateNumber,
    [type.Date]: duplicateDate,
    [type.Object]: duplicateObject
}