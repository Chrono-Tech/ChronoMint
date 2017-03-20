import isEthAddress from '../../src/utils/isEthAddress';

describe('Ethereum address validation', () => {
   it('should validate address', () => {
       expect(isEthAddress('')).toEqual(false);
       expect(isEthAddress('0x')).toEqual(false);

       expect(isEthAddress('0x2a65aca4d5fc5b5c859090a6c34d164135398226')).toEqual(true);
       expect(isEthAddress('0x2A65ACA4D5FC5D5C859090A6C34D164135398226')).toEqual(true);
   });
});