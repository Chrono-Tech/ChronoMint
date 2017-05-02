import AbstractContractDAO from './AbstractContractDAO'

// pending and completed
class OperationsDAO extends AbstractContractDAO {

}

export default new OperationsDAO(require('chronobank-smart-contracts/build/contracts/PendingManager.json'))
