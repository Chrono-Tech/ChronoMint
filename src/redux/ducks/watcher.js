import AppDAO from '../../dao/AppDAO';
import VoteDAO from '../../dao/VoteDAO';
import {used} from '../../components/common/flags';
import {watchUpdateCBE} from './settings/cbe';
import {watchUpdateToken} from './settings/tokens';
import {handleNewLOC} from './locs/data';
import {handleConfirmOperation, handleRevokeOperation} from './pendings/data';
import {handleNewPoll, handleNewVote} from './polls/data';

export const watcher = (account: string) => (dispatch) => {
    // Important! Only CBE can watch events below
    AppDAO.isCBE(account).then(isCBE => {
        if (!isCBE) {
            return;
        }
        if (!used(AppDAO.watchUpdateCBE))
            AppDAO.watchUpdateCBE(
                (cbe, ts, revoke) => dispatch(watchUpdateCBE(cbe, ts, revoke)),
                localStorage.getItem('chronoBankAccount')
            );
        if (!used(AppDAO.watchUpdateToken))
            AppDAO.watchUpdateToken((token, ts, revoke) => dispatch(watchUpdateToken(token, ts, revoke)));
        if (!used(AppDAO.newLOCWatch))
            AppDAO.newLOCWatch((address) => dispatch(handleNewLOC(address)));
        if (!used(AppDAO.confirmationWatch))
            AppDAO.confirmationWatch((operation) => dispatch(handleConfirmOperation(operation, account)));
        if (!used(AppDAO.revokeWatch))
            AppDAO.revokeWatch(
                (e, r) => dispatch(handleRevokeOperation(r.args.operation, account)) // TODO e defined but not used
            );
        if (!used(VoteDAO.newPollWatch))
            VoteDAO.newPollWatch((index) => dispatch(handleNewPoll(index)));
        if (!used(VoteDAO.newVoteWatch))
            VoteDAO.newVoteWatch((index) => dispatch(handleNewVote(index)));

        // ^ Free string above is for your watchers ^
    });
};