const WAIT_FOR_METAMASK = 2000 // ms

const metaMaskPromise = new Promise((resolve) => {
  let metaMaskInstance
  let timer

  timer = setTimeout(() => {
    timer = null
    resolve(false)
  }, WAIT_FOR_METAMASK)

  if (window.web3 !== undefined) {
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

const MetaMaskResolver = () => {
  return metaMaskPromise
}

export default MetaMaskResolver
