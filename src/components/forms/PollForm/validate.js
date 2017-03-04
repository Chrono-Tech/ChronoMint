import * as validate from '../validate';

export default (values) => {
    const errors = {};
    const jsValues = values.toJS();

    errors.pollTitle = validate.name(jsValues.pollTitle);

    // errors.pollDescription = validate.name(jsValues.pollDescription);

    let filledCount = 0;
    if (jsValues.options) {
        const optionsArrayErrors = [];

        jsValues.options.forEach((option, optionIndex) => {
            if (option && option.length){
                filledCount++;
                if (option.length < 3) {
                    optionsArrayErrors[optionIndex] = 'Should have length more than or equal 3 symbols';
                }
            }
        });
        if (optionsArrayErrors.length) {
            errors.options = optionsArrayErrors
        }
    }

    if (!jsValues.options || jsValues.options.length < 2 || filledCount < 2) {
        errors.options = { _error: 'At least two options must be filled' }
    }

    return errors;
};
