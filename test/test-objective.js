////////////////////////////
// Initialize
////////////////////////////
const chai  = require('chai');
const { types, is } = require('tupos');
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

        it('Should shallow merge objects', function() {
            const objectRef = {
                a: 1
            };

            const mainObj = {
                b: {
                    d: 1
                }
            };

            const subObj = {
                b: {
                    c: objectRef
                }
            }

            const result = mergeObjects(mainObj, subObj);
            expect(result.b.c).to.equal(objectRef);
        });
    });

    describe('destructure()', function() {
        it('Should decompose an object into its component paths', function() {
            const paths = [
                [ 'a.b.c', 'path 1' ],
                [ 'a.b.d', true ],
                [ 'a.c.e.f.0', {} ]
            ];
            const object = paths.reduce(
                (obj, [ path, val ]) => resolvePathAndSet(obj, path, val),
                {}
            );
            
            const result = destructure(object);
            const resultPaths = Object.entries(result);
            expect(resultPaths.length).to.equal(paths.length);
            resultPaths.forEach(
                ([ path, val ]) => {
                    const [ originalPath, originalVal ] = paths.find( ([ _path ]) => _path === path);
                    expect(path).to.equal(originalPath);
                    expect(val).to.equal(originalVal);
                }
            )
        });

        it('Should account for a custom traversal', function() {
            const isArray = is(types.ARRAY);
            const shouldTraverse = val => !isArray(val);
            const paths = [
                [ 'a.b.c', [ 'path 1', 'path 2', 'path 3' ] ],
                [ 'a.b.d', true ],
                [ 'a.c.e.f.0', {} ]
            ];
            const object = paths.reduce(
                (obj, [ path, val ]) => resolvePathAndSet(obj, path, val),
                {}
            );
            
            const result = destructure(object, null, shouldTraverse);
            const resultPaths = Object.entries(result);
            expect(resultPaths.length).to.equal(paths.length);
            resultPaths.forEach(
                ([ path, val ]) => {
                    const [ originalPath, originalVal ] = paths.find( ([ _path ]) => _path === path);
                    expect(path).to.equal(originalPath);
                    expect(val).to.equal(originalVal);
                }
            )
        });
    });

    describe('copyObject()', function() {
        it('Should return empty object if given empty object', function() {
            const obj = {};
            const result = copyObject(obj);

            expect(deepEquals(result, obj)).to.be.true;
        });

        it('Should copy an object', function() {
            const obj = {
                a: 1,
                b: true,
                c: {
                    d: 'tell me a tale',
                    e: { f: { g: null } }
                }
            };
            const result = copyObject(obj);

            expect(deepEquals(result, obj)).to.be.true;
        });
    });

    describe('contains()', function() {
        it('Should return true', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { d: 3 } }
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { c: 2 } }
                ]
            ];
            const results = objects.map(
                ( [ obj, subObj ]) => contains(obj, subObj)
            );

            expect(results.every(result => result)).to.be.true;
        });

        it('Should return false', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { d: 4 } }
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { c: { d: 3 } } }
                ]
            ];
            const results = objects.map(
                ( [ obj, subObj ]) => contains(obj, subObj)
            );

            expect(results.some(result => result)).to.be.false;
        });
    });

    describe('deepEquals()', function() {
        it('Should return true', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { c: 2, d: 3 } }
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } }
                ]
            ];
            const results = objects.map(
                ( [ obj, subObj ]) => deepEquals(obj, subObj)
            );

            expect(results.every(result => result)).to.be.true;
        });

        it('Should return false', function() {
            const objects = [
                [
                    { a: 1, b: { c: 2, d: 3 } },
                    { a: 1, b: { d: 4 } }
                ],
                [
                    { a: 1, b: { a: 1, b: { c: 2, d: 3 } } },
                    { a: 1, b: { a: 1, b: { c: 2, d: 4 } } }
                ]
            ];
            const results = objects.map(
                ( [ obj, subObj ]) => deepEquals(obj, subObj)
            );

            expect(results.some(result => result)).to.be.false;
        });
    });

    describe('deepMerge()', function() {
        it('Should create a deep copy before merging', function() {
            const objectRef = {
                a: 1
            };

            const mainObj = {
                b: {
                    d: 1
                }
            };

            const subObj = {
                b: {
                    c: objectRef
                }
            }

            const result = deepMerge(mainObj, subObj);
            expect(result.b.c).to.not.equal(objectRef);
        });
    });
});