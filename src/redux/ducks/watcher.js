import AppDAO from '../../dao/AppDAO';
import VoteDAO from '../../dao/VoteDAO';
import {watchInitCBE} from './settings/cbe';
import {watchInitToken} from './settings/tokens';
import {watchInitContract as watchInitOtherContract} from './settings/otherContracts';
import {handleNewLOC} from './locs/data';
import {handlePendingConfirmation, handleRevokeOperation} from './pendings/data';
import {handleNewPoll, handleNewVote} from './polls/data';

// Important! Action creator below is only for CBE events
export const cbeWatcher = (account) => (dispatch) => {
    /** SETTINGS >>> **/
    dispatch(watchInitCBE(account));
    dispatch(watchInitToken(account));
    dispatch(watchInitOtherContract(account));
    /** <<< SETTINGS **/

    AppDAO.newLOCWatch((address) => dispatch(handleNewLOC(address)));
    AppDAO.newConfirmationWatch((operation) => dispatch(handlePendingConfirmation(operation, account)));
    AppDAO.newRevokeWatch((operation) => dispatch(handleRevokeOperation(operation, account)));
    VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)));
    VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)));
};