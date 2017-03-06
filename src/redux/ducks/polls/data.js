/*eslint new-cap: ["error", { "capIsNewExceptions": ["NewPoll"] }]*/
import VoteDAO from '../../../dao/VoteDAO';
import {/*updatePollInStore, */createPollInStore} from './polls';
// import {notify} from '../../../redux/ducks/notifier/notifier';
// import LOCNoticeModel from '../../../models/notices/LOCNoticeModel';
// import {store} from '../../configureStore';
import {used} from '../../../components/common/flags';

const newPoll = (props) => {
    const account = localStorage.getItem('chronoBankAccount');
    let {pollTitle, /*pollDescription, */options} = props;
    VoteDAO.NewPoll(pollTitle, options, account)
        .catch(error => console.error(error));
};

const supportPoll = (props) => {
    const account = localStorage.getItem('chronoBankAccount');
    let {pollKey} = props;
    return VoteDAO.vote(pollKey, 1, account)
        .then(r => r)
        .catch(error => console.error(error));
};

const declinePoll = (props) => {
    const account = localStorage.getItem('chronoBankAccount');
    let {pollKey} = props;
    return VoteDAO.vote(pollKey, 2, account)
        .then(r => r)
        .catch(error => console.error(error));
};

// const handleNewPoll = (pollTitle) => (dispatch) => {
//     createPollInStore(pollTitle);//.then(loc => {dispatch(notify(new LOCNoticeModel({loc})))}); todo
// };

const getPolls = (account) => (dispatch) => {
    //dispatch(pendingsLoading());
    // const promises = [];
    VoteDAO.getPollTitles(account).then(
        r => r.forEach(createPollInStore)

    // Promise.all(promises).then(() => dispatch(pendingsLoaded()));
    );
};

const getPollsOnce = () => (dispatch) => {
    if (used(getPolls)) return;
    dispatch(getPolls(localStorage.chronoBankAccount));
};

export {
    newPoll,
    // loadPoll,
    // handleNewPoll,
    supportPoll,
    declinePoll,
    getPollsOnce
}