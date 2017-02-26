import OrbitDB from 'orbit-db';
import sha3 from 'crypto-js/sha3';

/**
 * OrbitDB data access object. See API documentation below for the full documentation.
 * @link https://github.com/haadcode/orbit-db/blob/master/API.md
 */
class OrbitDAO {
    init(ipfsNode) {
        this.orbit = new OrbitDB(ipfsNode);
    }

    /**
     * You should not use this private method or this.orbit directly as well.
     * To interact with Orbit DB use public methods secured with sha3 below.
     * @returns {OrbitDB}
     * @private
     */
    _db() {
        if (!this.orbit) {
            throw new Error('Orbit is undefined. Please use init() to initialize it.');
        }
        return this.orbit;
    }
    
    _enc(string) {
        return String(sha3(string));
    }

    /**
     * @param channel
     * @returns {string}
     * @private
     */
    _ch(channel: string) {
        return 'ChronoMint.' + this._enc(channel);
    }

    /**
     * You should not use this private method. Use set() and get()
     * secured with sha3 below to interact with key-value store.
     * @link https://github.com/haadcode/orbit-db-kvstore#usage
     * @param channel
     * @returns {Promise}
     * @private
     */
    _kv(channel: string) {
        return new Promise(resolve => {
            const kv = this._db().kvstore(this._ch(channel));
            console.log('CHANNEL', this._ch(channel));
            kv.events.on('ready', () => {
                resolve(kv);
            });
        });
    }
    
    set(channel: string, key: string, value) {
        return this._kv(channel).then(kv => {
            return kv.put(this._enc(key), value);
        });
    }
    
    get(channel: string, key: string) {
        return this._kv(channel).then(kv => {
            console.log('KEY', this._enc(key));
            return kv.get(this._enc(key));
        });
    }

    /** @link https://github.com/haadcode/orbit-db-eventstore#usage */
    event(channel: string) {
        return new Promise(resolve => {
            const log = this._db().eventlog(this._ch(channel));
            log.events.on('ready', () => {
                resolve(log);
            });
        });
    }

    /** @link https://github.com/haadcode/orbit-db-feedstore#usage */
    feed(channel: string) {
        return new Promise(resolve => {
            const feed = this._db().feed(this._ch(channel));
            feed.events.on('ready', () => {
                resolve(feed);
            });
        });
    }

    /** @link https://github.com/orbitdb/orbit-db-docstore#usage */
    docs(channel: string) {
        return new Promise(resolve => {
            const docs = this._db().docstore(this._ch(channel));
            docs.events.on('ready', () => {
                resolve(docs);
            });
        });
    }

    /** @link https://github.com/haadcode/orbit-db-counterstore#usage */
    counter(channel: string) {
        return new Promise(resolve => {
            const counter = this._db().counter(this._ch(channel));
            counter.events.on('ready', () => {
                resolve(counter);
            });
        });
    }
}

export default new OrbitDAO();