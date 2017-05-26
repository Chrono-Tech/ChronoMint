import Web3Converter from '../../src/utils/Web3Converter'

it('should be convert to ether', () => {
  let ether = Web3Converter.fromWei('96820460646994890000')
  expect(ether).toEqual('96.82046064699489')

  ether = Web3Converter.fromWei(96820460646994890000)
  expect(ether).toEqual(96.82046064699489)

  ether = Web3Converter.fromWei(96820460646994580000)
  expect(ether).toEqual(96.82046064699458)
})
