const usedObj = {};
let resetted = false;
const reset = () => {
    resetted = true;
    for (let member in usedObj) {
        if(1) delete usedObj[member];
    }
};

const used = (item) => {
    return ( usedObj[item] === ( usedObj[item] = true ) || !resetted);
};

export {
    used,
    reset
};