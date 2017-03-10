/*eslint new-cap: ["error", { "capIsNewExceptions": ["NewPoll"] }]*/
import VoteDAO from '../../../dao/VoteDAO';
import {updatePollInStore, createPollInStore} from './polls';
// import {notify} from '../../../redux/ducks/notifier/notifier';
// import PollNoticeModel from '../../../models/notices/PollNoticeModel';
import PollOptionModel from '../../../models/PollOptionModel';
import {used} from '../../../components/common/flags';

const newPoll = (props) => {
    const account = localStorage.getItem('chronoBankAccount');
    let {pollTitle, pollDescription, options} = props;
    options = options.filter(o => o && o.length);
    VoteDAO.NewPoll(pollTitle, pollDescription, options, account)
        .catch(error => console.error(error));
};

const votePoll = (props) => {
    const account = localStorage.getItem('chronoBankAccount');
    let {pollKey, optionIndex} = props;
    return VoteDAO.vote(pollKey, optionIndex + 1, account)
        .then(r => r)
        .catch(error => console.error(error));
};

// const handleNewPoll = (pollTitle) => (dispatch) => {
//     createPollInStore(pollTitle);//.then(loc => {dispatch(notify(new LOCNoticeModel({loc})))}); todo
// };

const loadPoll = (index, account) => (dispatch, getState) => {
    if (index === null){debugger;return Promise.resolve(false)};
    const callback = (poll) => {
        const promise0 = VoteDAO.getOptionsVotesForPoll(index, account);
        const promise1 = VoteDAO.getOptionsForPoll(index, account);
        return Promise.all([promise0, promise1]).then((r) => {
            poll.options = r[0].map( (votes, index) =>new PollOptionModel({index, votes, description: r[1][index]}) );
            dispatch(createPollInStore(poll, index));
        });
//        updatePollInStore(poll, index);
    };

    const promise = VoteDAO.polls(index, account).then(callback);
    return promise.then(() => getState().get('polls').get(index));
};

const getPolls = (account) => (dispatch) => {
    //dispatch(pendingsLoading());
    VoteDAO.pollsCount(account).then(r => {
        for (let i=0; i < r.toNumber(); i++){
            dispatch(loadPoll(i, account));
        }
            // Promise.all(promises).then(() => dispatch(pendingsLoaded()));
    });
};

const getPollsOnce = () => (dispatch) => {
    if (used(getPolls)) return;
    dispatch(getPolls(localStorage.chronoBankAccount));
};

const handleNewPoll = (index) => (dispatch) => {
    dispatch(loadPoll(index, localStorage.chronoBankAccount));//.then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
};

const handleNewVote = (voteIndex) => (dispatch, getState) => {
    const pollIndex =  getState().get('poll').index();
    dispatch(loadPoll(pollIndex, localStorage.chronoBankAccount));//.then(loc => {dispatch(notify(new LOCNoticeModel({loc})))});
};

export {
    newPoll,
    // loadPoll,
    votePoll,
    getPollsOnce,
    handleNewPoll,
    handleNewVote
}