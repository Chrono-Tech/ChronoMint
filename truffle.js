module.exports = {
  // build: {
  //   "index.html": "index.html",
  //   "app.js": [
  //     "javascripts/app.js"
  //   ],
  //   "app.css": [
  //     "stylesheets/app.css"
  //   ],
  //   "images/": "images/"
  // },
  mocha:{
    timeout:0,
    test_timeout:0,
    before_timeout:0
  },
  networks: {
   "live": {
     network_id: 1,
     host: "localhost"
   },
   "morden": {
    network_id: 2,        // Official Ethereum test network
    host: "localhost", // Random IP for example purposes (do not use)
    test_timeout:0,
    before_timeout:0
   },
   "ropsten": {
    network_id: 3,        // Official Ethereum test network
    host: "localhost", // Random IP for example purposes (do not use)
    test_timeout:0,
    before_timeout:0
  }
 },
 rpc: {
   host: "localhost",
   port: 8545,
   gas:3290337
 }
};
