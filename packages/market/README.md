# How to use this package

It consists of two parts which both should be plugged in to an App:
* middleware - WS connection to cryptocompare service and hadle assosiated events
* redux - osbviously, set of thunks/actions which may be used by an App

## Plug middleware part

```
import {
  connect,
  subscribe,
  setEventHandler,
  } from '@chronobank/market/middleware/actions'

dispatch(connect())
    .then(() => {
      store.dispatch(setEventHandler())
        .then(() => {
          store.dispatch(subscribe())
        })
    })
    .catch((error) => {
      // handle an errors
    })

```

### Market middleware's actions

Each middleware's action retuurns Promise, that's why each action may be chained.
Developer has full control and may handle any error in appropriate way.

* connect - start connection to WS host (see URL in the middleware/constants.js)
* disconnect - stop all subscriptions and disconnect WS
* subscribe - subscribe for all hardcoded market pairs (see middleware/utils/ccc-streamer-utitlities.js)
* unsubscribe - unsubscribe all previously subscribed subscriptions
* unsetEventhandler(event: string) - unset all callbacks for an event.
* setEventHandler(event: string, action: function) - set a callback for an event. For example:
  ```
  import { setEventHandler } from '@chronobank/market/middleware/actions'
  import { marketUpdate } from '@chronobank/market/middleware/thunks'

  dispatch(setEventHandler('m', marketUpdate))

  ```
  INFO: There is no 'm' description on official page of CryptoCompare,
  'm' got from the example https://github.com/cryptoqween/cryptoqween.github.io/blob/master/streamer/current/stream.js

## Plug redux part
```
import { DUCK_MARKET } from '@chronobank/market/redux/constants'
import market from '@chronobank/market/redux/reducers'

export default combineReducers({
  [DUCK_MARKET]: market,
})
```

### Market's actions

* marketUpdate
*

## Additional info:

* CryptoCompare API: https://www.cryptocompare.com/api/
* CryptoCompare usage example: https://github.com/cryptoqween/cryptoqween.github.io

