# ChronoMint [![Build Status](https://travis-ci.org/ChronoBank/ChronoMint.svg?branch=develop)](https://travis-ci.org/ChronoBank/ChronoMint) 
Control panel for ChronoBank and Labour-Offering Companies.

## Deploying
NodeJS 6+ required.
```bash
npm install -g ethereumjs-testrpc
npm install -g truffle
```

Then start TestRPC in a separate terminal by doing
```bash
testrpc -l 0x88E7C4	
```

Then deploy
```bash
truffle migrate
```

Then start server by doing
```bash
npm run start
```
