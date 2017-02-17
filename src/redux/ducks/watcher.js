import AppDAO from '../../dao/AppDAO';
import {watchUpdateCBE, watchRevokeCBE} from './settings/cbe';
import {watchUpdateToken} from './settings/tokens';

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
            (token, notExist) => dispatch(watchUpdateToken(token, notExist))
        );

        // ^ Free string above is for your watchers ^
    });
};