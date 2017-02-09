export default (values) => {
    const errors = {};
    if (!values.get('LOCName')) {
        errors.name = 'Required'
    } else if (values.get('LOCName').length < 3) {
        errors.name = 'Must be 3 characters or more'
    }

    if (!values.get('publishedHash')) {
        errors.publishedHash = 'Required'
    }

    if (!values.get('website')) {
        errors.website = 'Required'
    } else if (!/(http(s)?:\/\/)?[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.get('website'))) {
        errors.website = 'Invalid website address'
    }

    if (!values.get('issueLimit')) {
        errors.issueLimit = 'Required'
    } else if (isNaN(Number(values.get('issueLimit')))) {
        errors.issueLimit = 'Please enter valid amount'
    } else if (Number(values.get('issueLimit')) < 100) {
        errors.issueLimit = 'Must be 100 or more'
    }

    return errors;
};
