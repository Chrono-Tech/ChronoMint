import LHTProxyDAO from '../../../src/dao/LHTProxyDAO';
import TokenContractModel, {validate} from '../../../src/models/contracts/TokenContractModel';

/** @type TokenContractModel */
let contract;

describe('token contract model', () => {
    beforeAll(() => {
        return LHTProxyDAO.getAddress().then(proxy => {
            return LHTProxyDAO.getLatestVersion().then(address => {
                contract = new TokenContractModel({
                    address,
                    name: 'Labour Hour',
                    proxy,
                    symbol: 'LHT',
                    totalSupply: 10500
                });
            });
        });
    });

    it('should return proxy', () => {
        return contract.proxy().then(proxy => {
            return proxy.getAddress().then(proxyAddress => {
                return proxy.getLatestVersion().then(address => {
                    expect(proxyAddress).toEqual(contract.proxyAddress());
                    expect(address).toEqual(contract.address());
                });
            });
        });
    });

    it('should return symbol', () => {
        expect(contract.symbol()).toEqual('LHT');
    });

    it('should return symbol', () => {
        expect(contract.totalSupply()).toEqual(10500);
    });

    it('should validate', () => {
        const values = new Map();
        values.set('address', contract.address());
        expect(validate(values)).toEqual({
            'address': null
        });
    });
});