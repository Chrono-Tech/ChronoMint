/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

const MockSocket = require('socket.io-mock')

const client = jest.genMockFromModule('socket.io-client')

client.mockImplementation(() => new MockSocket())

module.exports = client
