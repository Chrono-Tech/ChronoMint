const stubServer = require('ethereumjs-stub-rpc-server')
const http = require('http')
const querystring = require('querystring')
const request = require('request')

const server = stubServer.createStubServer('WS', 'ws://localhost:8546')

server.addResponder((requestJso) => {
  const postData = querystring.stringify(requestJso)

  const options = {
    hostname: 'localhost',
    port: 8545,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Connection': 'keep-alive',
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Length': Buffer.byteLength(postData)
    }
  }

  const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`)
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
    res.setEncoding('utf8')
    res.on('data', (chunk) => {
      console.log(`BODY: ${chunk}`)
    })

  })

  req.on('error', (e) => {
    // eslint-disable-next-line
    console.error('error', e.message)
  })

  req.write(postData)
  return req.end()
})
