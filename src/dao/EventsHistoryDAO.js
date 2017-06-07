import AbstractContractDAO from './AbstractContractDAO'

/**
 * ATTENTION! Don't use this class to watch or get events!
 * @see PlatformEmitterDAO
 * @see EmitterDAO
 */
class EventsHistoryDAO extends AbstractContractDAO {
}

export default new EventsHistoryDAO(require('chronobank-smart-contracts/build/contracts/EventsHistory.json'))
