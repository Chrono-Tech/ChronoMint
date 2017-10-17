import App from './app'
import Web3 from 'web3'

require('events').EventEmitter.defaultMaxListeners = 0

// fix for 'for-of' iterations for iPhone6/Safari
NodeList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]
FileList.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator]

// hack for working with web3 v1 and providers
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send


App.start()
