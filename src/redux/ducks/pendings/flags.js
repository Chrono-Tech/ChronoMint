const usedObj = {};

const reset = () => {
    for (let member in usedObj) delete usedObj[member];
};

const used = (item) => {
    return ( usedObj[item] == ( usedObj[item] = true ) );
};

export {
    used,
    reset
};