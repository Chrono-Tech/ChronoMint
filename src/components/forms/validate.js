import isEthAddress from '../../utils/isEthAddress';

export const address = (value, required = true) => {
    if ((!value && required) || (value && !isEthAddress(value))) {
        return 'Should be valid ethereum address';
    }
    return null;
};

export const name = (value, required = true) => {
    if ((!value && required) || (value && value.length < 3)) {
        return 'Should have length more than or equal 3 symbols';
    }
    return null;
};

export const email = (value, required = true) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if ((!value && required) || (value && !re.test(value))) {
        return 'Should be valid email address';
    }
    return null;
};

export const positiveInt = value => {
    if (!/^[1-9][\d]*$/.test(value)) {
        return 'Should be positive integer';
    }
    return null;
};