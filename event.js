const fs = require('fs')
const Web3ABI = require('web3-eth-abi')

const folder ='./node_modules/chronobank-smart-contracts/build/contracts/'
const searchTopic = '0x8a1e3d1b07283e4c133a6cc3779cd8c05688adb2efed51aa9d621b6fb95b0586'

fs.readdir(folder, (err, files) => {
  files.forEach(file => {
    const ControllerAbi = JSON.parse(fs.readFileSync(folder + file, 'utf8'))
    const ControllerAbiEvents = ControllerAbi.abi.filter(x => x.type === 'event')
    ControllerAbiEvents.map(x => {
      if (searchTopic === Web3ABI.encodeEventSignature(x)) {
        console.log(x.name, Web3ABI.encodeEventSignature(x))
      }
    })
  })
})
