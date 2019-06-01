////////////////////////////
// Initialize
////////////////////////////
const chai  = require('chai');
const {
    resolvePathAndGet,
    resolvePathAndSet,
    destructure
} = require('../src/objectivize');

const expect = chai.expect;

////////////////////////////
// Test
////////////////////////////
describe('objectivize.js', function() {
    describe('resolvePathAndGet()', function() {
        it('Should get property in object', function() {
            const obj = {
                a: {
                    b: {
                        c: [ 1, 2, 3 ]
                    }
                }
            };
            const path = 'a.b.c.1';
            const result = resolvePathAndGet(obj, path);
            expect(result).to.equal(obj.a.b.c[1]);
        });

        it('Should return null for non-existent path', function() {
            const obj = {
                a: {
                    b: {
                        c: [ 1, 2, 3 ]
                    }
                }
            };
            const path = 'a.b.d';
            const result = resolvePathAndGet(obj, path);
            expect(result).to.equal(null);
        });
    });

    describe('resolvePathAndSet()', function() {
        it('Should set a value in an existent path', function() {
            const obj = {
                a: {
                    b: {
                        c: [ 1, 2, 3 ]
                    }
                }
            };
            const path = 'a.b.c';
            const setValue = 1;
            const result = resolvePathAndSet(obj, path, setValue);
            const objectPaths = destructure(result);

            expect(Object.keys(objectPaths).length).to.equal(1);
            expect(result.a.b.c).to.equal(setValue);
        });

        it('Should create non-existent paths during traversal', function() {
            const obj = {
                a: {
                    b: {
                        c: 1
                    }
                }
            };
            const path = 'a.b.d';
            const setValue = 2;
            const result = resolvePathAndSet(obj, path, setValue);
            const resultPaths = destructure(result);

            expect(Object.keys(resultPaths).length).to.equal(2);
            expect(result.a.b.d).to.equal(setValue);
        });
    });
});