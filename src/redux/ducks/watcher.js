import AppDAO from '../../dao/AppDAO';
import CBEDAO from '../../dao/CBEDAO';
import TokenContractsDAO from '../../dao/TokenContractsDAO';
import OtherContractsDAO from '../../dao/OtherContractsDAO';
import VoteDAO from '../../dao/VoteDAO';
import {watchUpdateCBE} from './settings/cbe';
import {watchUpdateToken} from './settings/tokens';
import {watchUpdateContract as watchUpdateOtherContract} from './settings/otherContracts';
import {handleNewLOC} from './locs/data';
import {handlePendingConfirmation, handleRevokeOperation} from './pendings/data';
import {handleNewPoll, handleNewVote} from './polls/data';

export const watcher = (account: string) => (dispatch) => {
    // Important! Only CBE can watch events below
    CBEDAO.isCBE(account).then(isCBE => {
        if (!isCBE) {
            return;
        }
        /** SETTINGS >>> **/
        CBEDAO.watch(
            (cbe, ts, revoke) => dispatch(watchUpdateCBE(cbe, ts, revoke)),
            localStorage.getItem('chronoBankAccount')
        );
        TokenContractsDAO.watch((token, ts, revoke) => dispatch(watchUpdateToken(token, ts, revoke)));
        OtherContractsDAO.watch((contract, ts, revoke) => dispatch(watchUpdateOtherContract(contract, ts, revoke)));
        /** <<< SETTINGS END **/

        AppDAO.newLOCWatch((address) => dispatch(handleNewLOC(address)));
        AppDAO.newConfirmationWatch((operation) => dispatch(handlePendingConfirmation(operation, account)));
        AppDAO.newRevokeWatch((operation) => dispatch(handleRevokeOperation(operation, account)));
        VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)));
        VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)));

        // ^ Free string above is for your watchers ^
    });
};