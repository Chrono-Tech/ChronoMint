import AppDAO from '../../dao/AppDAO';
import {watchUpdateCBE} from './settings/cbe';
import {watchUpdateToken} from './settings/tokens';
import {handleNewLOC} from './locs/data';
import {handleConfirmOperation, handleRevokeOperation} from './pendings/data';

export const watcher = (account: string) => (dispatch) => {
    // Important! Only CBE can watch events below
    AppDAO.isCBE(account).then(isCBE => {
        if (!isCBE) {
            return;
        }
        AppDAO.watchUpdateCBE(
            (cbe, ts, revoke) => dispatch(watchUpdateCBE(cbe, ts, revoke)),
            localStorage.getItem('chronoBankAccount')
        );
        AppDAO.watchUpdateToken((token, ts, revoke) => dispatch(watchUpdateToken(token, ts, revoke)));
        AppDAO.newLOCWatch(
            (e, r) => dispatch(handleNewLOC(r.args._LOC)) // TODO e defined but not used
        );
        AppDAO.confirmationWatch(
            (e, r) => dispatch(handleConfirmOperation(r.args.operation, account)) // TODO e defined but not used
        );
        AppDAO.revokeWatch(
            (e, r) => dispatch(handleRevokeOperation(r.args.operation, account)) // TODO e defined but not used
        );

        // ^ Free string above is for your watchers ^
    });
};