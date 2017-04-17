import AbstractContractDAO from './AbstractContractDAO'

const SCAN_MAX_THREADS = 200

class ChronoMintDAO extends AbstractContractDAO {
  /**
   * Scan an individual block
   *
   * This is called once for every block found between the
   * starting block and the ending block.
   *
   * Here we just look for transactions in the block, and then
   * we scan each of those.
   *
   * NOTE This is called asynchronously, so the block you
   * see here might have actually happened AFTER the block
   * you see the next time this is called.  To determine
   * synchronicity, you need to look at `block.timestamp`
   *
   * @param {Object} block
   * @link https://github.com/ethereum/wiki/wiki/JavaScript-API#web3ethgetblock
   * @param {function} callback Function to call after this range has been fully scanned.
   * It must accept these arguments: (txn, block)
   * @private
   */
  _scanBlockCallback = (block, callback) => {
    if (block.transactions) {
      for (let i = 0; i < block.transactions.length; i++) {
        const txn = block.transactions[i]
        callback(txn, block)
      }
    }
  }

  /**
   * Scan a range of blocks
   *
   * Spawn up to `maxThreads` threads to scan blocks in the
   * range provided.
   *
   * Note that if you pass undefined for `stoppingBlock`, its
   * value will be computed at the beginning of the function,
   * so any blocks added during the scan will not be processed.
   *
   * @param {number|hex} startingBlock First block to scan.
   * @param {number|hex} stoppingBlock (Optional) Last block to scan. If undefined, scan all blocks.
   * @param {number} range Range of blocks to scan prior to last block.
   * @param {function} callback Function to call after this range has been fully scanned.
   * It must accept these arguments: (error, lastScannedBlockNumber)
   * @param {function} scanTransactionCb Function to call after this range has been fully scanned.
   * @returns {number} Number of threads started. They will continue working asynchronously in the background.
   */
  scanBlockRange = (range, startingBlock, stoppingBlock, scanTransactionCb, callback) => {
    // If they didn't provide an explicit stopping block, then read
    // ALL of the blocks up to the current one.

    if (typeof stoppingBlock === 'undefined' || stoppingBlock === null) {
      stoppingBlock = this.web3.eth.blockNumber
    }

    if (typeof startingBlock === 'undefined' || startingBlock === null) {
      startingBlock = stoppingBlock - range > 0 ? stoppingBlock - range : 0
    }

    console.log(startingBlock, stoppingBlock)

    // If they asked for a starting block that's after the stopping block,
    // that is an error (or they're waiting for more blocks to appear,
    // which hasn't yet happened).

    if (startingBlock > stoppingBlock) {
      return -1
    }

    let blockNumber = startingBlock
    let gotError = false
    let numThreads = 0
    // startTime = new Date();

    const getPercentComplete = (bn) => {
      const t = stoppingBlock - startingBlock
      const n = bn - startingBlock
      return Math.floor((n / t) * 100, 2)
    }

    const exitThread = () => {
      if (--numThreads === 0) {
        if (callback) {
          callback(gotError, stoppingBlock)
        }
      }
      return numThreads
    }

    const asyncScanNextBlock = () => {
      // If we've encountered an error, stop scanning blocks
      if (gotError) {
        return exitThread()
      }

      // If we've reached the end, don't scan more blocks
      if (blockNumber > stoppingBlock) {
        return exitThread()
      }

      // Scan the next block and assign a callback to scan even more
      // once that is done.
      const myBlockNumber = blockNumber++

      // Write periodic status update so we can tell something is happening
      if (myBlockNumber % SCAN_MAX_THREADS === 0 || myBlockNumber === stoppingBlock) {
        const pctDone = getPercentComplete(myBlockNumber)
        console.log(`\rScanning block ${myBlockNumber} - ${pctDone} %`)
      }

      // Async call to getBlock() means we can run more than 1 thread
      // at a time, which is MUCH faster for scanning.

      this.web3.eth.getBlock(myBlockNumber, true, (error, block) => {
        if (error) {
          // Error retrieving this block
          gotError = true
          console.error('Error:', error)
        } else {
          this._scanBlockCallback(block, scanTransactionCb)
          asyncScanNextBlock()
        }
      })
    }

    let nt
    for (nt = 0; nt < SCAN_MAX_THREADS && startingBlock + nt <= stoppingBlock; nt++) {
      numThreads++
      asyncScanNextBlock()
    }

    return nt // number of threads spawned (they'll continue processing)
  }
}

export default new ChronoMintDAO(require('../contracts/ChronoMint.json'))
