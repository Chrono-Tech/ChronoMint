export default () => Object.defineProperty(window, 'localStorage', {
    value: (() => {
        let store = {};
        return {
            getItem: (key) => store[key],
            setItem: (key, value) => store[key] = value.toString(),
            clear: () => store = {}
        };
    })()
});