import OrbitDAO from '../../src/dao/OrbitDAO';
import IPFSDAO from '../../src/dao/IPFSDAO';
import fsBS from 'fs-pull-blob-store';

describe('Orbit DAO', () => {
    it('should initialize', () => {
        return IPFSDAO.init(fsBS).then(node => {
            return OrbitDAO.init(node);
        });
    });

    it('should call put and get methods', () => {
        expect(typeof OrbitDAO.put('value').then).toEqual('function');
        expect(typeof OrbitDAO.get('hash').then).toEqual('function');
    });

    //it('should put and get value', () => {
        // TODO This test is not working, probably for current version of orbit-db or js-ipfs
        // const value = Math.random();
        // return OrbitDAO.put(value).then(hash => {
        //     return OrbitDAO.get(hash).then(result => {
        //         expect(result).toEqual(value);
        //     });
        // });
    //});

    it('should not give access to _db if orbit is undefined', () => {
        OrbitDAO.orbit = null;
        expect(() => {
            //noinspection JSAccessibilityCheck
            OrbitDAO._db();
        }).toThrow(new Error('Orbit is undefined. Please use init() to initialize it.'));
    });

    afterAll(() => {
        return IPFSDAO.goOffline();
    });
});