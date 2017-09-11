const WAIT_FOR_METAMASK = 2000 // ms

export default () => {
  return new Promise((resolve) => {
    let timer
    let metaMaskInstance

    timer = setTimeout(() => {
      timer = null
      resolve(false)
    }, WAIT_FOR_METAMASK)

    if (window.web3 !== undefined || window.hasOwnProperty('web3')) {
      return resolve(true)
    }
    // wait for metamask
    Object.defineProperty(window, 'web3', {
      set: (web3) => {
        timer && clearTimeout(timer)
        metaMaskInstance = web3
        resolve(true)
      },
      get: () => {
        return metaMaskInstance
      }
    })
  })
}
