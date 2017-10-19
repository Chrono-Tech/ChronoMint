const stubServer = require('ethereumjs-stub-rpc-server')
const http = require('http')
const querystring = require('querystring')
const request = require('request')

const server = stubServer.createStubServer('WS', 'ws://localhost:8546')

server.addResponder((requestJso) => {
  const postData = JSON.stringify(requestJso)

  const options = {
    hostname: 'localhost',
    port: 8545,
    form: postData
  }
  
  request.post('http://localhost:8545', options, (err,httpResponse,body) => {
    if(err) console.error(err)
    console.log('body', body)
  });
})
