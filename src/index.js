import App from './app';

if (process.env.NODE_ENV === 'development' && (!localStorage.getItem('setupLoc') || localStorage.getItem('setupLoc')=="false" ) ) {
    App.bootstrapContracts();
}

App.start();