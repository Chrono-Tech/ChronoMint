import { checkPinCode } from './redux/sensitive/actions'

export default function initReactNative ({ dispatch }) {
  document.addEventListener('message', ({ data }) => {
    try {
      const { message, ...payload } = JSON.parse(data)

      switch (message) {
        case 'PINCODE_CORRECT':
          dispatch(checkPinCode(payload.wallet))
          break
        default: break
      }
    }
    catch (e) {
      return
    }
  })
}