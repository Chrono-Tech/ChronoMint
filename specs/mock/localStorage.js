export default () => Object.defineProperty(window, 'localStorage', {
    value: (() => {
        let store = {};
        //noinspection JSUnusedGlobalSymbols
        return {
            getItem: (key) => store[key],
            setItem: (key, value) => store[key] = value.toString(),
            removeItem: (key) => delete store[key],
            length: () => Object.keys(store).length,
            clear: () => store = {}
        };
    })()
});