import * as validate from '../validate';

export default (values) => {
    const errors = {};
    const jsValues = values.toJS();

    errors.locName = validate.name(jsValues.locName);

    if (!jsValues.publishedHash) {
        errors.publishedHash = 'Required';
    }

    if (!jsValues.website) {
        errors.website = 'Required'
    } else if (!/(http(s)?:\/\/)?[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(jsValues.website)) {
        errors.website = 'Invalid website address';
    }

    if (!jsValues.issueLimit) {
        errors.issueLimit = 'Required';
    } else if (isNaN(Number(jsValues.issueLimit))) {
        errors.issueLimit = 'Please enter valid amount';
    }/* else if (Number(jsValues.issueLimit) < 100) {
        errors.issueLimit = 'Must be 100 or more';
    }*/

    return errors;
};
