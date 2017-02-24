import IPFS from 'ipfs';

class IPFSDAO {
    init() {
        return new Promise((resolve, reject) => {
            const node = new IPFS({
                repo: String(Math.random()),
                EXPERIMENTAL: {
                    pubsub: true
                }
            });
            node.init({emptyRepo: true, bits: 2048}, err => {
                if (err) {
                    reject(err);
                }
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
            });
        });
    }

    getNode() {
        if (!this.node) {
            throw 'Node is undefined. Please use init() to initialize it.';
        }
        return this.node;
    }
}

export default new IPFSDAO();