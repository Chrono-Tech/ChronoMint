const usedObj = {};

const reset = () => {
    for (let member in usedObj) {
        if(1) delete usedObj[member];
    }
};

const used = (item) => {
    return ( usedObj[item] === ( usedObj[item] = true ) );
};

export {
    used,
    reset
};