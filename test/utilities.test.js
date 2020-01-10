////////////////////////////
// Initialize
////////////////////////////
const chai = require('chai');
const sinon = require('sinon');
const { convertPathsToArray, normalizePaths, hasObjectAndPath, hasObjectPathAndValue, isValidPath } = require('../src/utilities');

const expect = chai.expect;

////////////////////////////
// Test
////////////////////////////
describe('utilities.js', function() {
    describe('convertPathsToArray()', function() {
        it('Should convert a period-separated string into an array', function() {
            const params = [ 'abc', 'abc.def' ];
            const results = params.map(convertPathsToArray);
            const answers = [
                [ 'abc' ],
                [ 'abc', 'def' ]
            ];

            answers.forEach((answer, idx) => {
                const result = results[idx];
                expect(answer).to.deep.equal(result);
            });
        });

        it('Should convert numbers and symbols to one-element arrays', function() {
            const params = [
                1,
                Symbol()
            ];
            const results = params.map(convertPathsToArray);
            const answers = params.map(param => [ param ]);

            answers.forEach((answer, idx) => {
                const result = results[idx];
                expect(answer).to.deep.equal(result);
            });
        });

        it('Should return any other value unchanged', function() {
            const params = [
                [ 'abc', 'def' ],
                true,
                {}
            ];
            const results = params.map(convertPathsToArray);

            results.forEach((result, idx) => {
                const param = params[idx];
                expect(result).to.deep.equal(param);
            });
        });
    });

    describe('normalizePaths()', function() {
        it('Should only modify the second (path) parameter', function() {
            const fn = sinon.spy();
            const path = 'abc';
            const pathArr = convertPathsToArray(path);
            const params = [ {}, path, {} ];

            const decoratee = normalizePaths(fn);
            decoratee(...params);

            const { args } = fn.getCall(0);
            expect(args[0]).to.equal(params[0]);
            expect(args[1]).to.deep.equal(pathArr);
            expect(args[2]).to.equal(params[2]);
        });
    });

    describe('hasObjectAndPath()', function() {
        it('Should return `undefined` if first param is not traversable', function() {
            const firstParams = [
                2,
                Symbol(),
                () => {}
            ];
            const decoratee = hasObjectAndPath(x => x);
            const results = firstParams.map(firstParam => decoratee(firstParam, 'abc'));

            results.forEach(result => {
                expect(result).to.be.undefined;
            });
        });

        it('Should return `undefined` if second param is not a valid path', function() {
            const secondParams = [
                true,
                {}
            ];
            const decoratee = hasObjectAndPath(x => x);
            const results = secondParams.map(secondParam => decoratee({}, secondParam));

            results.forEach(result => {
                expect(result).to.be.undefined;
            });
        });
    });

    describe('hasObjectPathAndValue()', function() {
        it('Should return `false` if first param is not traversable', function() {
            const firstParams = [
                2,
                Symbol(),
                () => {}
            ];
            const decoratee = hasObjectAndPath(x => x);
            const results = firstParams.map(firstParam => decoratee(firstParam, 'abc'));

            results.forEach(result => {
                expect(result).to.be.undefined;
            });
        });

        it('Should return `false` if second param is not a valid path', function() {
            const secondParams = [
                true,
                {}
            ];
            const decoratee = hasObjectAndPath(x => x);
            const results = secondParams.map(secondParam => decoratee({}, secondParam));

            results.forEach(result => {
                expect(result).to.be.undefined;
            });
        });

        it('Should return `false` if third param isn\'t supplied', function() {
            const decoratee = hasObjectPathAndValue(x => x);
            const result = decoratee({}, 'abc');

            expect(result).to.be.false;
        });
    });

    describe('isValidPath()', function() {
        it('Should return `true` for arrays of numbers, strings, symbols', function() {
            const paths = [
                [ 'abc' ],
                [ Symbol() ],
                [ 1 ],
                [ 'abc', Symbol(), 1 ]
            ];
            const result = paths.map(isValidPath).every(x => x);
            expect(result).to.be.true;
        });

        it('Should return `true` for numbers, strings, symbols', function() {
            const paths = [
                'abc',
                'abc.def',
                1,
                Symbol()
            ];
            const result = paths.map(isValidPath).every(x => x);
            expect(result).to.be.true;
        });

        it('Should return false for any other values', function() {
            const paths = [
                [ 1, true ],
                () => {},
                undefined
            ];
            const result = paths.map(isValidPath).some(x => x);
            expect(result).to.be.false;
        });
    });
});