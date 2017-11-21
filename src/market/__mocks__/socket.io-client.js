const MockSocket = require('socket.io-mock')

const client = jest.genMockFromModule('socket.io-client')

client.mockImplementation(() => new MockSocket())

module.exports = client
