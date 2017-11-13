/* eslint-disable no-console */
const fs = require('fs')
const importSort = require('import-sort').default
const style = require('../config/import-sort-style').default

const files = process.argv.slice(2)

if (files.length === 0) {
  process.exit(0)
}

console.log(
  '\x1b[43m\x1b[34m',
  ' SORTING IMPORTS ',
  '\x1b[0m'
)

function transform (file) {
  if (!/\.jsx?$/.test(file)) {
    return
  }
  console.log(file)

  const data = fs.readFileSync(file)
  const fd = fs.openSync(file, 'w')
  const fileText = data.toString()

  const result = importSort(fileText, 'import-sort-parser-babylon', style)
  if (result && result.code) {
    fs.writeSync(fd, result.code, 0, result.length)
  }
  fs.closeSync(fd)
}

files.forEach(transform)

console.log('\n', '\x1b[32m', files.length, '\x1b[0m', 'files changed', '\n')

process.exit(0)
