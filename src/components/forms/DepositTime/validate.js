export default (values) => {
    const errors = {};
    const jsValues = values.toJS();
    if (isNaN(jsValues.amount)) {
        errors.amount = "Must be valid number";
    } else if (jsValues.amount <= 0) {
        errors.amount = "Must be positive number";
    }
    return errors;
};
