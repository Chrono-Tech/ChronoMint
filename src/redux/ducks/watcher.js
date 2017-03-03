import AppDAO from '../../dao/AppDAO';
import {watchUpdateCBE, watchRevokeCBE} from './settings/cbe';
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
            cbe => dispatch(watchUpdateCBE(cbe)),
            cbe => dispatch(watchRevokeCBE(cbe)),
            account
        );
        AppDAO.watchUpdateToken(
            token => dispatch(watchUpdateToken(token))
        );
        AppDAO.newLOCWatch(
            (e, r) => dispatch(handleNewLOC(r.args._LOC))
        );
        AppDAO.confirmationWatch(
            (e, r) => dispatch(handleConfirmOperation(r.args.operation, account))
        );
        AppDAO.revokeWatch(
            (e, r) => dispatch(handleRevokeOperation(r.args.operation, account))
        );

        // ^ Free string above is for your watchers ^
    });
};