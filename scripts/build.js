process.env.NODE_ENV = process.env.NODE_ENV || 'production'

console.log('NODE_ENV:', process.env.NODE_ENV)

const path = require('path')
const rimrafSync = require('rimraf').sync
const webpack = require('webpack')
const config = require('../config/webpack.config.prod')

const isInNodeModules = path.basename(path.resolve(path.join(__dirname, '..', '..'))) === 'node_modules'
const relative = isInNodeModules ? '../..' : '.'
rimrafSync(relative + '/build_front')

webpack(config).run(function (err, stats) {
  if (err) {
    console.error('Failed to create a production build. Reason:')
    console.error(err.message || err)
    process.exit(1)
  }

  if (process.env.NODE_ENV === 'standalone') {
    console.log(`
    Successfully generated a bundle in the build folder!
    Open 'build/index.html' in your browser.
    `)
  } else {
    console.log(`
    Successfully generated a bundle in the build folder!
    You can now serve it with any static server, for example:
    
      npm run hs

    The bundle is optimized and ready to be deployed to production.`)
  }
})
