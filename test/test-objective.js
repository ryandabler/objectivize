////////////////////////////
// Initialize
////////////////////////////
const chai  = require('chai');
const {
    resolvePathAndGet,
    resolvePathAndSet,
    generateObjectFromPath,
    mergeObjects,
    destructure,
    copyObject,
    contains,
    deepEquals,
    deepMerge
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
            const path = 'a.b.d.e';
            const setValue = 2;
            const result = resolvePathAndSet(obj, path, setValue);
            const resultPaths = destructure(result);

            expect(Object.keys(resultPaths).length).to.equal(2);
            expect(resolvePathAndGet(result, path)).to.equal(setValue);
        });
    });

    describe('generateObjectFromPath()', function() {
        it('Should generate an object with a specified path terminating with a value', function() {
            const path = 'a.b.c';
            const value = 'test value';
            const result = generateObjectFromPath(value, path);
            const resultPaths = destructure(result);

            expect(Object.keys(resultPaths).length).to.equal(1);
            expect(resolvePathAndGet(result, path)).to.equal(value);
        });
    });

    describe('mergeObjects()', function() {
        it('Should merge in shape as-is if no collisions ', function() {
            const mainObj = {
                a: 1,
                b: 2,
                e: {
                    f: 1
                }
            };

            const subObject = {
                c: 3,
                d: {
                    e: 'abc'
                },
                e: {
                    g: 2
                }
            };

            const result = mergeObjects(mainObj, subObject);
            const resultPaths = destructure(result);

            expect(contains(result, subObject)).to.be.true;
            expect(Object.keys(resultPaths).length).to.equal(6);
        });

        it('Should combine keys into an array when colliding', function() {
            const mainObj = {
                a: 1,
                b: 2
            };

            const subObject = {
                b: 3
            };

            const finalObject = {
                a: 1,
                b: [ 2, 3 ]
            };

            const result = mergeObjects(mainObj, subObject);

            expect(contains(result, finalObject)).to.be.true;
        });

        it('Should concat merged property if main property is an array', function() {
            const mainObj = {
                a: 1,
                b: [ 2, 4 ]
            };

            const subObject = {
                b: 3
            };

            const result = mergeObjects(mainObj, subObject);
            const resultPaths = destructure(result);

            expect(Object.keys(resultPaths).length).to.equal(4);
            expect(resolvePathAndGet(result, 'b.2')).to.equal(subObject.b);
        });
    });

    describe('destructure()', function() {
        it('Should ... ', function() {
            
        });
    });

    describe('copyObject()', function() {
        it('Should ... ', function() {
            
        });
    });

    describe('contains()', function() {
        it('Should ... ', function() {
            
        });
    });

    describe('deepEquals()', function() {
        it('Should ... ', function() {
            
        });
    });

    describe('deepMerge()', function() {
        it('Should ... ', function() {
            
        });
    });
});