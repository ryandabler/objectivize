const { types, isOneOf } = require('tupos');

const isKeyed = isOneOf(
    types.OBJECT,
    types.ARRAY,
    types.INT8ARRAY,
    types.UINT8ARRAY,
    types.UINT8CLAMPEDARRAY,
    types.INT16ARRAY,
    types.UINT16ARRAY,
    types.INT32ARRAY,
    types.UINT32ARRAY,
    types.FLOAT32ARRAY,
    types.FLOAT64ARRAY
);

module.exports = { isKeyed };