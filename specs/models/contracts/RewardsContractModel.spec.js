import RewardsDAO from '../../../src/dao/RewardsDAO';
import RewardsContractModel from '../../../src/models/contracts/RewardsContractModel';

/** @type RewardsContractModel */
let contract;

describe('rewards contract model', () => {
    beforeAll(() => {
        return RewardsDAO.getAddress().then(address => {
            contract = new RewardsContractModel(address);
        });
    });

    it('should return dao', () => {
        return contract.dao().then(dao => {
            return dao.getAddress().then(address => {
                expect(address).toEqual(contract.address());
            });
        });
    });

    it('should return name', () => {
        expect(contract.name()).toEqual('Rewards');
    });
});