import OrbitDB from 'orbit-db';

class OrbitDAO {
    init(ipfsNode) {
        this.orbit = new OrbitDB(ipfsNode);

        // TODO REMOVE tmp orbit test >>>
        const kv = this.orbit.kvstore('ChronoMint.settings');
        console.log('ORBIT OUT', kv.get('volume'));
        kv.put('volume', '105').then(() => {
            console.log('ORBIT IN', kv.get('volume'));
        });
        // TODO REMOVE <<<
    }

    db() {
        if (!this.orbit) {
            throw new Error('Orbit is undefined. Please use init() to initialize it.');
        }
        return this.orbit;
    }
}

export default new OrbitDAO();