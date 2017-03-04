import VoteDAO from '../../../dao/VoteDAO';
import {updateLOCinStore, createLOCinStore} from './polls';
import {notify} from '../../../redux/ducks/notifier/notifier';
import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
import {store} from '../../configureStore';

const loadPoll = (address) => {
    const account = localStorage.getItem('chronoBankAccount');
    const poll = new VoteDAO(address).contract;

    const callback = (valueName, value) => {
        updatePollinStore(valueName, value, address);
    };
    createPollinStore(address);
    //.....
    return Promise.all(promises).then(() => store.getState().get('poll').get(address));
};

const newPoll = (props) => {
    const account = localStorage.getItem('chronoBankAccount');
    let {pollTitle, pollDescription, options} = props;
    VoteDAO.NewPoll(pollTitle, options, account)
        .catch(error => console.error(error));
};

const handleNewPoll = (address) => (dispatch) => {
    loadLOC(address).then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
};

const account = localStorage.getItem('chronoBankAccount');
// PollDAO.getPolls(account)//todo     if (used(getPolls)) return;
//     .then(r => r.forEach(loadPoll));
    // componentWillMount(){ todo move to page like:
    //     this.props.getPendingsOnce();
    // }


export {
    newPoll,
    loadPoll,
    handleNewPoll
}