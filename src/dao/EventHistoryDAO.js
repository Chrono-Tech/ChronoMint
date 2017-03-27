import AbstractContractDAO from './AbstractContractDAO';
import ChronoMintDAO from './ChronoMintDAO';

class EventHistoryDAO extends AbstractContractDAO {
    addEmitter = (signature, platformEmitterAddress) => {
        return ChronoMintDAO.getAddress().then(address => {
            this.contract.then(deployed => {
                deployed.addEmitter(signature, platformEmitterAddress, {from: address});
            })
        });
    };
}

export default new EventHistoryDAO(require('../contracts/EventsHistory.json'));