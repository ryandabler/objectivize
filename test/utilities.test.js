////////////////////////////
// Initialize
////////////////////////////
const chai = require('chai');
const sinon = require('sinon');
const { types } = require('tupos');
const { splitStringPaths, normalizePaths, hasObjectAndPath, hasObjectPathAndValue } = require('../src/utilities');

const { $FUNCTION } = types;

const expect = chai.expect;

////////////////////////////
// Test
////////////////////////////
describe('utilities.js', function() {
    describe('splitStringPaths()', function() {
        it('Should convert a period-separated string into an array', function() {
            const params = [ 'abc', 'abc.def' ];
            const results = params.map(splitStringPaths);
            const answers = [
                [ 'abc' ],
                [ 'abc', 'def' ]
            ];

            answers.forEach((answer, idx) => {
                const result = results[idx];
                expect(answer).to.deep.equal(result);
            });
        });

        it('Should return any other value unchanged', function() {
            const params = [
                [ 'abc', 'def' ],
                1,
                {}
            ];
            const results = params.map(splitStringPaths);

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
            const pathArr = splitStringPaths(path);
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
            })
        });

        it('Should return `undefined` if second param is not a valid path', function() {
            const secondParams = [
                1,
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
            })
        });

        it('Should return `false` if second param is not a valid path', function() {
            const secondParams = [
                1,
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
});