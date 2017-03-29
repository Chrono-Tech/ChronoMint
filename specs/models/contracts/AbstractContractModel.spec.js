import AbstractContractModel, {validate} from '../../../src/models/contracts/AbstractContractModel';

/** @type AbstractContractModel */
let contract;

describe('abstract contract model', () => {
    it('should not construct class', () => {
        expect(() => {
            new AbstractContractModel()
        }).toThrow(new TypeError('Cannot construct AbstractContractModel instance directly'));
    });

    it('should validate', () => {
        const values = new Map();
        values.set('address', '0xfc20893b53d186d89da816e507353e04209f9fc4');
        values.set('name', 'ChronoMint');
        expect(validate(values)).toEqual({
            'address': null,
            'name': null
        });
    });
});