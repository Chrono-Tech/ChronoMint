import reducer, {
  setTimeBalanceStart,
  setTimeBalanceSuccess,
  setTimeDepositSuccess,
  setLHTBalanceStart,
  setLHTBalanceSuccess,
  setETHBalanceStart,
  setETHBalanceSuccess,
  setTransactionStart,
  setTransactionSuccess,
  setContractsManagerLHTBalanceStart,
  setContractsManagerLHTBalanceSuccess
} from '../../../src/redux/wallet/reducer'

describe('Wallet reducer', () => {
  let state = reducer(undefined, {})

  it('should be initial state: isFetching==true, balance==null', () => {
    expect(state.time.isFetching).toEqual(true)
    expect(state.time.balance).toEqual(null)
  })

  it('Start setting balance. isFetching should be True', () => {
    const action = setTimeBalanceStart()
    const prevBalance = state.time.balance
    state = reducer(state, action)
    expect(state.time.isFetching).toEqual(true)
    expect(state.time.balance).toEqual(prevBalance)
  })

  it('Finish set balance. isFetching should be False, balance changed.', () => {
    const balance = 100500
    const action = setTimeBalanceSuccess(balance)
    state = reducer(state, action)
    expect(state.time.isFetching).toEqual(false)
    expect(state.time.balance).toEqual(balance)
  })

  it('Finish set time deposit. isFetching should be False, deposit changed.', () => {
    const deposit = 100600
    const action = setTimeDepositSuccess(deposit)
    state = reducer(state, action)
    expect(state.time.isFetching).toEqual(false)
    expect(state.time.deposit).toEqual(deposit)
  })

  it('Start setting LHT balance. isFetching should be True', () => {
    const action = setLHTBalanceStart()
    const prevBalance = state.lht.balance
    state = reducer(state, action)
    expect(state.lht.isFetching).toEqual(true)
    expect(state.lht.balance).toEqual(prevBalance)
  })

  it('Finish set LHT balance. isFetching should be False, balance changed.', () => {
    const balance = 100700
    const action = setLHTBalanceSuccess(balance)
    state = reducer(state, action)
    expect(state.lht.isFetching).toEqual(false)
    expect(state.lht.balance).toEqual(balance)
  })

  it('Start setting ETH balance. isFetching should be True', () => {
    const action = setETHBalanceStart()
    const prevBalance = state.eth.balance
    state = reducer(state, action)
    expect(state.eth.isFetching).toEqual(true)
    expect(state.eth.balance).toEqual(prevBalance)
  })

  it('Finish set ETH balance. isFetching should be False, balance changed.', () => {
    const balance = 100800
    const action = setETHBalanceSuccess(balance)
    state = reducer(state, action)
    expect(state.eth.isFetching).toEqual(false)
    expect(state.eth.balance).toEqual(balance)
  })

  it('Start fetch transaction. isFetching should be True', () => {
    const action = setTransactionStart()
    state = reducer(state, action)
    expect(state.isFetching).toEqual(true)
  })

  it('Finish transaction. isFetching should be False, transactions changed.', () => {
    const data = {txHash: 10090}
    const action = setTransactionSuccess(data)
    state = reducer(state, action)
    expect(state.isFetching).toEqual(false)
    expect(state.transactions.get(10090).txHash).toEqual(10090)
  })

  it('Start setting Contracts Manager LHT balance. isFetching should be True', () => {
    const action = setContractsManagerLHTBalanceStart()
    const prevBalance = state.contractsManagerLHT.balance
    state = reducer(state, action)
    expect(state.contractsManagerLHT.isFetching).toEqual(true)
    expect(state.contractsManagerLHT.balance).toEqual(prevBalance)
  })

  it('Finish setting Contracts Manager LHT balance. isFetching should be False, balance changed.', () => {
    const balance = 100200
    const action = setContractsManagerLHTBalanceSuccess(balance)
    state = reducer(state, action)
    expect(state.contractsManagerLHT.isFetching).toEqual(false)
    expect(state.contractsManagerLHT.balance).toEqual(balance)
  })
})
