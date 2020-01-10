////////////////////////////
// Initialize
////////////////////////////
import { expect } from 'chai';
import sinon from 'sinon';
import { types } from 'tupos';
import { normalizeParams, ensureParams } from '../src/decorators';

const { $FUNCTION } = types;

////////////////////////////
// Test
////////////////////////////
describe('decorators.js', function() {
    describe('normalizeParams()', function() {
        it('Should return a function when run', function() {
            const normalizingFn = normalizeParams();
            expect($FUNCTION(normalizingFn)).to.be.true;
        });

        describe('`normalizeParams` return function', function() {
            it('Should return a function called "withNormalizedParams"', function() {
                const normalizingFn = normalizeParams();
                const withNormalizedParams = normalizingFn();

                expect($FUNCTION(withNormalizedParams)).to.be.true;
                expect(withNormalizedParams.name).to.equal(
                    'withNormalizedParams'
                );
            });

            describe('withNormalizedParams()', function() {
                it('Should call as many normalizing functions as parameters supplied', function() {
                    const nFn1 = sinon.spy();
                    const nFn2 = sinon.spy();
                    const nFn3 = sinon.spy();

                    const normalizingFn = normalizeParams(nFn1, nFn2, nFn3);
                    const withNormalizedParams = normalizingFn(x => x);
                    withNormalizedParams(0, 1);

                    sinon.assert.calledOnce(nFn1);
                    sinon.assert.calledOnce(nFn2);
                    sinon.assert.notCalled(nFn3);
                });

                it('Should call each normalizing function once', function() {
                    const nFn = sinon.spy();

                    const normalizingFn = normalizeParams(nFn);
                    const withNormalizedParams = normalizingFn(x => x);
                    withNormalizedParams(0);

                    sinon.assert.calledOnce(nFn);
                });

                it('Should call each normalizing function with its respective param', function() {
                    const nFn1 = sinon.spy();
                    const nFn2 = sinon.spy();

                    const normalizingFn = normalizeParams(nFn1, nFn2);
                    const withNormalizedParams = normalizingFn(x => x);
                    withNormalizedParams(0, 'a');

                    sinon.assert.calledWith(nFn1, 0);
                    sinon.assert.calledWith(nFn2, 'a');
                });

                it('Should default to identity function for params beyond amount that is normalized', function() {
                    const nFn = n => 2 * n;
                    const dFn = sinon.spy();
                    const params = [1, {}, false];

                    const normalizingFn = normalizeParams(nFn);
                    const withNormalizedParams = normalizingFn(dFn);
                    withNormalizedParams(...params);

                    sinon.assert.calledWith(dFn, 2, {}, false);
                });

                it('Should call the decorated function with transformed params', function() {
                    const nFn = n => 2 * n;
                    const dFn = sinon.spy();

                    const normalizingFn = normalizeParams(nFn);
                    const withNormalizedParams = normalizingFn(dFn);
                    withNormalizedParams(1);

                    sinon.assert.called(dFn);
                    sinon.assert.calledWith(dFn, 2);
                    sinon.assert.neverCalledWith(dFn, 1);
                });
            });
        });
    });

    describe('ensureParams()', function() {
        it('Should return a function when run', function() {
            const ensuringFn = ensureParams();
            expect($FUNCTION(ensuringFn)).to.be.true;
        });

        describe('`ensureParams` return function', function() {
            it('Should return a function called "withEnsuredParams"', function() {
                const ensuringFn = ensureParams();
                const withEnsuredParams = ensuringFn();

                expect($FUNCTION(withEnsuredParams)).to.be.true;
                expect(withEnsuredParams.name).to.equal('withEnsuredParams');
            });

            describe('withEnsuredParams()', function() {
                it('Should call `onInvalid` if ensurer functions have different cardinality than params', function() {
                    const onInvalid = sinon.spy();
                    const ensurerFn = () => true;

                    const ensuringFn = ensureParams(onInvalid, ensurerFn);
                    const withEnsuredParams = ensuringFn(x => x);
                    withEnsuredParams(0, 1);

                    sinon.assert.calledOnce(onInvalid);
                });

                it('Should call `onInvalid` if any ensurer function returns false', function() {
                    const onInvalid = sinon.spy();
                    const eFn1 = () => true;
                    const eFn2 = () => false;

                    const ensuringFn = ensureParams(onInvalid, eFn1, eFn2);
                    const withEnsuredParams = ensuringFn(x => x);
                    withEnsuredParams(0, 1);

                    sinon.assert.calledOnce(onInvalid);
                });

                it('Should call every ensurer function with its respective param', function() {
                    const onInvalid = () => {};
                    const ensuringFns = [
                        sinon.fake.returns(true),
                        sinon.fake.returns(true),
                    ];
                    const params = ensuringFns.map((_, idx) => idx);

                    const ensuringFn = ensureParams(onInvalid, ...ensuringFns);
                    const withEnsuredParams = ensuringFn(x => x);
                    withEnsuredParams(...params);

                    params.forEach((param, idx) => {
                        const ensuringFn = ensuringFns[idx];
                        sinon.assert.calledWith(ensuringFn, param);
                    });
                });

                it('Should call decorated function if all params are valid', function() {
                    const onInvalid = sinon.spy();
                    const TRUE = () => true;
                    const decoratee = sinon.spy();
                    const param = 0;

                    const ensuringFn = ensureParams(onInvalid, TRUE);
                    const withEnsuredParams = ensuringFn(decoratee);
                    withEnsuredParams(param);

                    sinon.assert.notCalled(onInvalid);
                    sinon.assert.calledWith(decoratee, param);
                });
            });
        });
    });
});
