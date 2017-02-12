export default (values) => {
    const errors = {};

    const amountPattern = new RegExp(/[^.]\d{2,}/);

    const addressPattern = new RegExp(/^0x.{40}/);

    if (!values.get('recipient')) {
        errors.recipient = 'Enter recipient address';
    } else if (!addressPattern.test(values.get('recipient'))) {
        errors.recipient = 'Should be a valid address';
    }

    if (!values.get('amount')) {
        errors.amount = 'Enter amount for exchange';
    } else if (amountPattern.test(values.get('amount'))) {
        errors.amount = 'Can have only 2 decimal places';
    }

    return errors;
};