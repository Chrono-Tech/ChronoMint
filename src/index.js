import App from './app';
/////////////////////
debugger;
localStorage.setItem('setupLoc', false);
/////////////////////
if (process.env.NODE_ENV === 'development' && (!localStorage.getItem('setupLoc') || localStorage.getItem('setupLoc')=="false" ) ) {
    App.bootstrapContracts();
}

App.start();