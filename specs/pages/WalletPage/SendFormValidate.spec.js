import validator from '../../../src/components/pages/WalletPage/SendFormValidate';
import Immutable from 'immutable';

describe('SendFormValidate', () => {
   it('should validate Ethereum address', () => {
       expect(validator(new Immutable.Map({recipient:'0x2a65aca4d5fc5b5c859090a6c34d164135398226', amount:'2'})))
           .toEqual({});
       expect(validator(new Immutable.Map({recipient:'0x2A65ACA4D5FC5D5C859090A6C34D164135398226', amount:'2'})))
           .toEqual({});

       let errors = validator(new Immutable.Map({recipient:'0x2K65ACL4D5FC5D5C859090A6C34D164135398226', amount:'2'}));
       expect(errors.recipient).toBeDefined();
   });
});