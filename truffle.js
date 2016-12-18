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
     host: "localhost",
     gas:3290337
   },
   "morden": {
    network_id: 2,
    host: "localhost",
    test_timeout:0,
    before_timeout:0,
    gas:3290337
   },
   "ropsten": {
    network_id: 3,
    host: "localhost",
    test_timeout:0,
    before_timeout:0,
    gas:3290337
  }
 },
 rpc: {
   host: "localhost",
   port: 8545,
   gas:3000000
 }
};
