////////////////////////////
// Initialize
////////////////////////////
import { expect } from 'chai';
import { types } from 'tupos';
import { keys, values, entries } from '../src/prototype';

const { $STRING, $SYMBOL } = types;

////////////////////////////
// Test
////////////////////////////
describe('keys(), values(), entries()', function() {
    const obj = {};
    const descriptors = [
        [
            'a',
            { value: 1, enumerable: true, configurable: true, writable: true },
        ],
        [
            'b',
            { value: 2, enumerable: false, configurable: true, writable: true },
        ],
        [
            Symbol('s'),
            { value: 3, enumerable: false, configurable: true, writable: true },
        ],
    ];

    before(function() {
        const descriptorMap = descriptors.reduce((acc, [key, descriptor]) => {
            acc[key] = descriptor;
            return acc;
        }, {});
        Object.defineProperties(obj, descriptorMap);
    });

    describe('keys()', function() {
        it('Should return all enumerable and non-enumerable keys', function() {
            const result = keys(obj);
            const _keys = descriptors.map(([key]) => key);
            expect(result.length).to.equal(descriptors.length);
            expect(result).to.have.members(_keys);
        });

        describe('keys.enum()', function() {
            it('Should return only enumerable keys', function() {
                const result = keys.enum(obj);
                const enumKeys = descriptors
                    .filter(([, descriptor]) => descriptor.enumerable)
                    .map(([key]) => key);
                expect(result.length).to.equal(enumKeys.length);
                expect(result).to.have.members(enumKeys);
            });
        });

        describe('keys.names()', function() {
            it('Should return all string keys', function() {
                const result = keys.names(obj);
                const stringKeys = descriptors
                    .filter(([key]) => $STRING(key))
                    .map(([key]) => key);
                expect(result.length).to.equal(stringKeys.length);
                expect(result).to.have.members(stringKeys);
            });
        });

        describe('keys.symbols()', function() {
            it('Should return all symbol keys', function() {
                const result = keys.symbols(obj);
                const symbolKeys = descriptors
                    .filter(([key]) => $SYMBOL(key))
                    .map(([key]) => key);
                expect(result.length).to.equal(symbolKeys.length);
                expect(result).to.have.members(symbolKeys);
            });
        });
    });

    describe('values()', function() {
        it('Should return values for all enumerable and non-enumerable properties', function() {
            const result = values(obj);
            const _values = descriptors.map(
                ([, descriptor]) => descriptor.value
            );
            expect(result.length).to.equal(descriptors.length);
            expect(result).to.have.members(_values);
        });

        describe('values.enum()', function() {
            it('Should return only values for enumerable properties', function() {
                const result = values.enum(obj);
                const enumValues = descriptors
                    .filter(([, descriptor]) => descriptor.enumerable)
                    .map(([, descriptor]) => descriptor.value);
                expect(result.length).to.equal(enumValues.length);
                expect(result).to.have.members(enumValues);
            });
        });

        describe('values.names()', function() {
            it('Should return values for all string properties', function() {
                const result = values.names(obj);
                const stringValues = descriptors
                    .filter(([key]) => $STRING(key))
                    .map(([, descriptor]) => descriptor.value);
                expect(result.length).to.equal(stringValues.length);
                expect(result).to.have.members(stringValues);
            });
        });

        describe('values.symbols()', function() {
            it('Should return values for all symbol properties', function() {
                const result = values.symbols(obj);
                const symbolValues = descriptors
                    .filter(([key]) => $SYMBOL(key))
                    .map(([, descriptor]) => descriptor.value);
                expect(result.length).to.equal(symbolValues.length);
                expect(result).to.have.members(symbolValues);
            });
        });
    });

    describe('entries()', function() {
        it('Should return entries for all enumerable and non-enumerable properties', function() {
            const result = entries(obj);
            const _entries = descriptors.map(([key, descriptor]) => [
                key,
                descriptor.value,
            ]);
            expect(result.length).to.equal(descriptors.length);
            expect(result).to.have.deep.members(_entries);
        });

        describe('entries.enum()', function() {
            it('Should return only entries for enumerable properties', function() {
                const result = entries.enum(obj);
                const enumEntries = descriptors
                    .filter(([, descriptor]) => descriptor.enumerable)
                    .map(([key, descriptor]) => [key, descriptor.value]);
                expect(result.length).to.equal(enumEntries.length);
                expect(result).to.have.deep.members(enumEntries);
            });
        });

        describe('entries.names()', function() {
            it('Should return entries for all string properties', function() {
                const result = entries.names(obj);
                const stringEntries = descriptors
                    .filter(([key]) => $STRING(key))
                    .map(([key, descriptor]) => [key, descriptor.value]);
                expect(result.length).to.equal(stringEntries.length);
                expect(result).to.have.deep.members(stringEntries);
            });
        });

        describe('entries.symbols()', function() {
            it('Should return entries for all symbol properties', function() {
                const result = entries.symbols(obj);
                const symbolEntries = descriptors
                    .filter(([key]) => $SYMBOL(key))
                    .map(([key, descriptor]) => [key, descriptor.value]);
                expect(result.length).to.equal(symbolEntries.length);
                expect(result).to.have.deep.members(symbolEntries);
            });
        });
    });
});
