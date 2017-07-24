```yaml

AbstractNoticeModel
- title: Notice
- icon: default (material error_outline)
- message: throw Error
- details: null

ArbitraryNoticeModel
- title: Notice (inherit from AbstractNoticeModel)
- icon: default (inherit from AbstractNoticeModel)
- message: %{From constructor argument}
- details: null (inherit from AbstractNoticeModel)

ApprovalNoticeModel # Тут проблема, details дублирует message
- title: Approval
- icon: Accept (material check)
- message: %{value} %{symbol} approved to transfer for %{contractName}
- details: [
  - label: 'Value', value: `${value} ${symbol}` },
  - label: 'Contract name', value: ${contractName} } # Не очень понимаю что это
]

CBENoticeModel
- title: CBE # Что тут вывести, CBE? Или просто Notice, унаследовать от AbstractNoticeModel?
- icon: default (inherit from AbstractNoticeModel) # Что тут вывести?
- message: CBE %{address} was added | CBE %{address} was removed
- details: [
  - label: 'Address', value: `${value} ${symbol}` # Дублирует description, нужно?
]

LOCNoticeModel
- title: LOC # Что тут вывести, LOC? Или просто Notice, унаследовать от AbstractNoticeModel?
- icon: default (inherit from AbstractNoticeModel) # Что тут вывести?
- message: CBE %{address} was added | CBE %{address} was removed
- details: [
  - label: 'Address', value: `${value} ${symbol}` # Дублирует description, нужно?
]

OperationNoticeModel # Насколько я понял, Operation логически расширяет LOC
- title: LOC # Что тут вывести, LOC? Или просто Notice, унаследовать от AbstractNoticeModel?
- icon: default (inherit from AbstractNoticeModel) # Что тут вывести?
- message: 'LOC \'%{name}\' (added|removed|updated|status updated|issued|failed'
- details: null

TokenNoticeModel
- title: Notice (inherit from AbstractNoticeModel)
- icon: default (inherit from AbstractNoticeModel)
- message: 'Token "%{symbol} – %{name}" was (added|modified|removed).'
- details: [ # Бред, параметрв бессмысленны, может не делать?
  - label: 'Symbol', value: `${symbol}`,
  - label: 'Name', value: `${name}`
]

TransferNoticeModel
- title: Transfer
- icon: wallet (material account_balance_wallet)
- message: '%{value} %{symbol} received from %{address}' | '%{value} %{symbol} sent to %{address}'
- details: [ # Бред, параметрв бессмысленны, может не делать?
  - label: 'Value', value: `${value} ${symbol}` }, # Дублирует description
  - label: 'Address', value: ${address} } # Дублирует subject и description
]

TransferErrorNoticeModel
- title: Error
- icon: error (material error)
- message: '%{error}'
- details: [
  - label: 'From', value: `${tx.from}` }
  - label: 'To', value: `${tx.to}` }
  - label: 'Value', value: `${value} ${symbol}`
]

```
