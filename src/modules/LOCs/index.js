import LOCContainer from './container'
module.exports = {
  path: 'accounts',

  getComponent(location, cb) {
    require.ensure([], () => {
      cb(null, Accounts)
    })
  }
}
