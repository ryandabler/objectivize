const normalizeParams = (...normalizerFns) => fn =>
  function withNormalizedParams(..._params) {
    const params = _params.map((param, idx) => normalizerFns[idx](param));
    return fn.call(this, ...params);
  };

const ensureParams = (onInvalid, ...ensurerFns) => fn =>
    function withEnsuredParams(...params) {
        const isValid = ensurerFns.length === params.length
            && ensurerFns.every((fn, idx) => fn(params[idx]));
        return isValid ? fn.call(this, ...params) : onInvalid(...params);
    };

module.exports = { normalizeParams, ensureParams };