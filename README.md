# ChronoMint [![Build Status](https://travis-ci.org/ChronoBank/ChronoMint.svg?branch=master)](https://travis-ci.org/ChronoBank/ChronoMint) [![Coverage Status](https://coveralls.io/repos/github/ChronoBank/ChronoMint/badge.svg?branch=votes)](https://coveralls.io/github/ChronoBank/ChronoMint)
Control panel for ChronoBank and Labour-Offering Companies.

## Requirements
* NodeJS 6+
* Unix based OS (or just create proper symlinks instead of *contracts*, *test*, *migrations* and *src/contracts* in the root)

## Install
Clone repo and run in the root dir:
```bash
git submodule init
git submodule update
npm install
export PATH=$PATH:$(pwd)/node_modules/.bin
```

## Run
Start TestRPC in a separate terminal by doing:
```bash
testrpc -l 0x88E7C4
```

Then deploy contracts with:
```bash
truffle migrate --reset
truffle exec setup/*
```

Finally in another separate terminal run:
```bash
npm start
```

Now you able to access ChronoMint dApp through the [http://localhost:3000/](http://localhost:3000/)

## Test
#### Smart contracts
In the root dir run:
```bash
truffle test
```

#### Application
In the root dir run:
```bash
npm test
```
To test separate specs just add your regex at the end.