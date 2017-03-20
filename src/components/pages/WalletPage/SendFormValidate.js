import isEthAddress from '../../../utils/isEthAddress';

export default (values) => {
    const errors = {};
    const amountPattern = new RegExp(/[^.]\d{2,}/);

    if (!values.get('recipient')) {
        errors.recipient = 'Enter recipient address';
    } else if (!isEthAddress(values.get('recipient'))) {
        errors.recipient = 'Should be a valid address';
    }

    if (!values.get('amount')) {
        errors.amount = 'Enter amount for exchange';
    } else if (amountPattern.test(values.get('amount'))) {
        errors.amount = 'Can have only 2 decimal places';
    }

    return errors;
};