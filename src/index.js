import App from './app'
import { registryCustomValidators, overrideValidatorMessages } from 'utils/validator'

require('events').EventEmitter.defaultMaxListeners = 0
registryCustomValidators()
overrideValidatorMessages()

App.start()
