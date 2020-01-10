/**
 * Accepts an arbitrary list of mapping functions and returns a decorator function.
 *
 * The decorator will intercept the parameters and pass them into their respective
 * mapping function (based on index). If more parameters are supplied to the
 * decoratee, the mapping functions will fall back to the identity function.
 *
 * @param  {...Function} normalizerFns
 * @returns {Function}
 */
const normalizeParams = (...normalizerFns) => fn =>
    function withNormalizedParams(..._params) {
        const params = _params.map((param, idx) => {
            const normalizerFn = normalizerFns[idx] || (x => x);
            return normalizerFn(param);
        });

        return fn.call(this, ...params);
    };

/**
 * Accepts an arbitrary list of validating functions and a function to run if
 * any parameter is invalid.
 *
 * The decorator will intercept the parameters and ensure that each parameter
 * passes its respective validating function (based on index). If any paramter
 * fails, an `onInvalid` function is run with the given parameters passed in.
 * This function requires all parameters to be validated.
 *
 * This decorator allows for ensurer functions to be marked as `optional`, in
 * which case if there is no corresponding parameter, it validates as true. If
 * a parameter _is_ supplied, it will be evaluated.
 *
 * @param {Function} onInvalid
 * @param  {...Function} ensurerFns
 * @returns {Function}
 */
const ensureParams = (onInvalid, ...ensurerFns) => fn =>
    function withEnsuredParams(...params) {
        const requiredFns = ensurerFns.filter(eFn => !eFn.optional);

        // A valid call is one in which there are at least as many
        // parameters passed as those that are marked as required,
        // more parameters are not passed than ensurerFns supplied,
        // and all ensurerFns that align with a parameter return true.
        const isValid =
            requiredFns.length <= params.length &&
            ensurerFns.length >= params.length &&
            ensurerFns.every((fn, idx) => {
                if (!Reflect.has(params, idx) && fn.optional) {
                    return true;
                }

                return fn(params[idx]);
            });

        return isValid ? fn.call(this, ...params) : onInvalid(...params);
    };

export { normalizeParams, ensureParams };
