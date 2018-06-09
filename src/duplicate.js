const { types } = require("tupos");

const duplicateString = str => str

const duplicateNumber = num => num

const duplicateDate = dt => new Date(dt)

const duplicate = {
    [type.String]: duplicateString,
    [type.Number]: duplicateNumber,
    [type.Date]: duplicateDate,
}