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
        retArr[key] = duplicate[typeOf(arr[key])](arr[key]);
    }

    return retArr;
}

const duplicateMapType = constructor => map => new constructor(map)

const duplicateSetType = constructor => set => new constructor(set)

const duplicatePromise = promise => promise.then()

const duplicateTypedArray = constructor => typedArr => {
    const newTypedArr = new constructor(typedArr.length);

    for (const key in typedArr) {
        newTypedArr[key] =
            duplicate[typeOf(typedArr[key])](typedArr[key]);
    }

    return newTypedArr;
}

const duplicateArrayBuffer = arrBuff => new ArrayBuffer(arrBuff.length)

const duplicateDataView = dv =>
    new DataView(dv.buffer, dv.byteOffset, dv.byteLength)

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
    [types.PROMISE]: duplicatePromise,
    [types.INT8ARRAY]: duplicateTypedArray(Int8Array),
    [types.UINT8ARRAY]: duplicateTypedArray(Uint8Array),
    [types.UINT8CLAMPEDARRAY]: duplicateTypedArray(Uint8ClampedArray),
    [types.INT16ARRAY]: duplicateTypedArray(Int16Array),
    [types.UINT16ARRAY]: duplicateTypedArray(Uint16Array),
    [types.INT32ARRAY]: duplicateTypedArray(Int32Array),
    [types.UINT32ARRAY]: duplicateTypedArray(Uint32Array),
    [types.FLOAT32ARRAY]: duplicateTypedArray(Float32Array),
    [types.FLOAT64ARRAY]: duplicateTypedArray(Float64Array),
    [types.ARRAYBUFFER]: duplicateArrayBuffer,
    [types.DATAVIEW]: duplicateDataView,
    [types.JSON]: identity,
    [types.GENERATOR]: identity,
    [types.GENERATORFUNC]: duplicateFunction,
    [types.WASM]: identity,
    [types.ASYNCFUNC]: duplicateFunction
}