import TxPaginator from '../../src/utils/TxsPaginator'

describe('txs paginator', () => {
  it('should paginate', () => {
    const paginator = new TxPaginator()
    paginator.sizePage = 2

    return Promise.all([
      paginator.findNext(),
      paginator.findNext(),
      paginator.findNext()
    ])
    .then(([txs, txs2, txs3]) => {
      expect(txs.length).toEqual(2)
      expect(txs2.length).toEqual(2)
      expect(txs3.length).toEqual(2)

      const paginator = new TxPaginator()
      paginator.sizePage = 6

      return paginator.findNext().then((allTxs) => {
        expect(txs.concat(txs2).concat(txs3).sort()).toEqual(allTxs.sort())
      })
    })
  })
})
