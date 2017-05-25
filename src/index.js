import App from './app'
import { registryCustomValidators } from 'utils/validator'

require('events').EventEmitter.defaultMaxListeners = 0
registryCustomValidators()

App.start()
