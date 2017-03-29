import IPFSDAO from '../../src/dao/IPFSDAO';
import fsBS from 'fs-pull-blob-store';

describe('IPFS DAO', () => {
    it('should initialize IPFS', () => {
        return IPFSDAO.init(fsBS).then(node => {
            expect(IPFSDAO.getNode()).toEqual(node);
        });
    });

    afterAll(() => {
        return IPFSDAO.goOffline();
    });
});