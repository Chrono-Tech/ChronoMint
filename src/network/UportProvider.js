import { Connect, QRUtil } from 'uport-connect'
const customOpenQr = (data, cancel) => {
  console.log('--UportProvider#customOpenQr', data)
  QRUtil.openQr(data, cancel)
}

const uportProvider = new Connect('ChronoBankTest', {
  uriHandler: customOpenQr,
  closeUriHandler: QRUtil.closeQr,
  clientId: '0xfbbf28aaba3b2fc6dfe1a02b9833ccc90b8c4d26'
})

export default uportProvider
