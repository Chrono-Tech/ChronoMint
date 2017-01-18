import App from './app';

if (process.env.NODE_ENV === 'development' && !localStorage.getItem('setupLoc')) {
    App.bootstrapContracts();
}

App.start();