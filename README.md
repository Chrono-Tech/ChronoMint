# ChronoMint [![Build Status](https://travis-ci.org/ChronoBank/ChronoMint.svg?branch=master)](https://travis-ci.org/ChronoBank/ChronoMint) [![Coverage Status](https://coveralls.io/repos/github/ChronoBank/ChronoMint/badge.svg)](https://coveralls.io/github/ChronoBank/ChronoMint) [![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
Control panel for ChronoBank

*NodeJS 7.9.0 required*

## Install
```bash
npm i
```
Then add *node_modules/.bin* to your *PATH* variable

## Development
Start TestRPC in a separate terminal by doing:
```bash
testrpc
```

Then in another separate terminal:
```bash
npm run bridge
```

Deploy contracts with:
```bash
npm run contracts
```

And finally:
```bash
npm start
```

Now you able to access ChronoMint dApp through the [http://localhost:3000/](http://localhost:3000/)

To open truffle console use:
```bash
npm run tconsole
```

## Test
```bash
npm test
```
To test separate specs just add your regex at the end of this command.