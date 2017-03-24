export default (values) => {
    const errors = {};
    const jsValues = values.toJS();
    if (!jsValues.numberOfSignatures) {
        errors.numberOfSignatures = 'Required'
    } else if (isNaN(Number(jsValues.numberOfSignatures))) {
        errors.numberOfSignatures = 'Please enter a valid number'
    } else if (Number(jsValues.numberOfSignatures) > 5) {
        errors.numberOfSignatures = 'Number is greater then 5'
    } else if (Number(jsValues.numberOfSignatures) < 1) {
        errors.numberOfSignatures = 'Must be greater then 0'
    }

    return errors;
};
