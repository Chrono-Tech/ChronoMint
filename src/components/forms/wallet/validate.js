import LS from '../../../utils/LocalStorage'
import { declarativeValidator } from '../../../utils/validator'
import { I18n } from 'react-redux-i18n'

const rules = {
  recipient: 'required|ethereum-address',
  amount: 'required|positive-number|currency-number',
}

export default (values, props) => {
  let errors = declarativeValidator(rules)(values)

  if (!errors.recipient && (values.get('recipient') == LS.getAccount())) {
    errors.recipient = [I18n.t('errors.cantSentToYourself')]
  }

  const balance = props.balances[values.get('currency')]
  if (!errors.amount && (balance - values.get('amount') < 0)) {
    errors.amount = [I18n.t('errors.notEnoughTokens')]
  }

  return errors;
}
