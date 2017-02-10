export default (values) => {
    const errors = {};

    const amountPattern = new RegExp(/[^.]\d{2,}/);

    if (!values.get('amount')) {
        errors.amount = 'Enter amount for exchange';
    } else if (amountPattern.test(values.get('amount'))) {
        errors.amount = 'Can have only 2 decimal places';
    }

    return errors;
};