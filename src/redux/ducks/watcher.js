import LOCsManagerDAO from '../../dao/LOCsManagerDAO';
import UserDAO from '../../dao/UserDAO';
import TokenContractsDAO from '../../dao/TokenContractsDAO';
import OtherContractsDAO from '../../dao/OtherContractsDAO';
import VoteDAO from '../../dao/VoteDAO';
import PendingManagerDAO from '../../dao/PendingManagerDAO';
import {watchUpdateCBE} from './settings/cbe';
import {watchUpdateToken} from './settings/tokens';
import {watchUpdateContract as watchUpdateOtherContract} from './settings/otherContracts';
import {handleNewLOC, handleRemoveLoc, handleUpdateLocStatus, handleUpdateLocValue} from './locs/actions';
import {handlePendingConfirmation, handleRevokeOperation} from './pendings/data';
import {handleNewPoll, handleNewVote} from './polls/data';

export const watcher = (account: string) => (dispatch) => {
    // Important! Only CBE can watch events below
    UserDAO.isCBE(account).then(isCBE => {
        if (!isCBE) {
            return;
        }
        /** SETTINGS >>> **/
        UserDAO.watchCBE(
            (cbe, ts, revoke) => dispatch(watchUpdateCBE(cbe, ts, revoke)),
            localStorage.getItem('chronoBankAccount')
        );
        TokenContractsDAO.watch((token, ts, revoke) => dispatch(watchUpdateToken(token, ts, revoke)));
        OtherContractsDAO.watch((contract, ts, revoke) => dispatch(watchUpdateOtherContract(contract, ts, revoke)));
        /** <<< SETTINGS END **/

        LOCsManagerDAO.newLOCWatch((address) => dispatch(handleNewLOC(address)));
        LOCsManagerDAO.remLOCWatch((address) => dispatch(handleRemoveLoc(address)));
        LOCsManagerDAO.updLOCStatusWatch((address, status) => dispatch(handleUpdateLocStatus(address, 'status', status)));
        LOCsManagerDAO.updLOCValueWatch((address, setting, value) => dispatch(handleUpdateLocValue(address, setting, value)));
        PendingManagerDAO.newConfirmationWatch((operation) => dispatch(handlePendingConfirmation(operation, account)));
        PendingManagerDAO.newRevokeOperationWatch((operation) => dispatch(handleRevokeOperation(operation, account)));
        VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)));
        VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)));

        // ^ Free string above is for your watchers ^
    });
};