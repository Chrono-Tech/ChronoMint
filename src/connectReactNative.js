/**
 * This singleton simplify and promisify React Native WewView messages flow.
 * It has postMessage method that accepts message name and payload and
 * returns a promise. The returned promise is resolving or rejecting
 * when answer from React Native was received.
 */
class ConnectReactNative {
  constructor () {
    this.handlers = {}

    document.addEventListener('message', ({ data }) => {
      try {
        const { message, ...payload } = JSON.parse(data)
        const handler = this.handlers[message]

        handler && handler.resolve(payload)
      } catch (e) { return }
    })
  }

  postMessage = async (message, payload = {}) => {
    const handler = new Promise((resolve, reject) => {
      this.handlers[message] = { resolve, reject }
    })
    
    await window.postMessage(JSON.stringify({ message, ...payload }))

    return await handler
  }
}

export default new ConnectReactNative()
