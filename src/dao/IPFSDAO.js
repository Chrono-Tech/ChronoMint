import IPFS from 'ipfs';

class IPFSDAO {
    constructor() {
        try {
            this.initNode();
        } catch (e) {
            alert('Oops! Something went wrong. Please try again later.' +
                ' IPFS initialization failed. Error: "' + e + '"');
            this.constructor();
        }
    }

    initNode() {
        const node = new IPFS(String(Math.random()));
        node.init({emptyRepo: true, bits: 2048}, err => {
            if (err) {
                throw err;
            }
            node.load(err => {
                if (err) {
                    throw err;
                }
                node.goOnline(err => {
                    if (err) {
                        throw err;
                    }
                    this.node = node;
                });
            });
        });
    }

    node() {
        return this.node;
    }
}

export default new IPFSDAO();