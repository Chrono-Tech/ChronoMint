import App from './app';
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === 'development') {
    //App.bootstrapContracts();
}
App.start();