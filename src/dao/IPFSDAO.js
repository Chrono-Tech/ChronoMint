import IPFS from 'ipfs';
import IPFSRepo from 'ipfs-repo';
import idbBS from 'idb-pull-blob-store';

class IPFSDAO {
    init() {
        return new Promise((resolve, reject) => {
            const repo = new IPFSRepo('ChronoMint', {stores: idbBS});
            const node = new IPFS({
                repo,
                EXPERIMENTAL: {
                    pubsub: true
                }
            });
            const callback = () => {
                node.load(err => {
                    if (err) {
                        reject(err);
                    }
                    node.goOnline(err => {
                        if (err) {
                            reject(err);
                        }
                        this.node = node;
                        resolve(node);
                    });
                });
            };
            repo.exists((err, exists) => {
                if (err) {
                    reject(err);
                }
                if (exists) {
                    callback();
                } else {
                    node.init({emptyRepo: true, bits: 2048}, err => {
                        if (err) {
                            reject(err);
                        }
                        callback();
                    });
                }
            });
        });
    }

    getNode() {
        if (!this.node) {
            throw new Error('Node is undefined. Please use init() to initialize it.');
        }
        return this.node;
    }
}

export default new IPFSDAO();