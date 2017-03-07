import React, {Component} from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import PageBase from '../pages/PageBase2';
import globalStyles from '../styles';
import {loadPoll} from '../redux/ducks/polls/poll';
import {showNewPollModal} from '../redux/ducks/ui/modal';
// import {dateFormatOptions} from '../config';
import {getPollsOnce} from '../redux/ducks/polls/data';
import Polls from '../components/pages/votingPage/Polls';

const mapStateToProps = (state) => ({
    polls: state.get('polls'),
});

const mapDispatchToProps = (dispatch) => ({
    showNewPollModal: pollKey => dispatch(showNewPollModal(pollKey)),
    getPollsOnce: () => dispatch(getPollsOnce()),
    loadPoll: index => dispatch(loadPoll(index)),
});

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {

    handleShowNewPollModal = () => {
        this.props.loadPoll();
        this.props.showNewPollModal();
    };

    componentWillMount(){
        this.props.getPollsOnce();
    }

    render() {
        const {polls} = this.props;
        return (
            <PageBase title={<div><span style={{verticalAlign: 'sub'}}>Voting </span> <RaisedButton
                label="NEW POLL"
                primary={true}
                style={{verticalAlign: 'text-bottom', fontSize: 15}}
                onTouchTap={this.handleShowNewPollModal}
                buttonStyle={{...globalStyles.raisedButton, }}
                labelStyle={globalStyles.raisedButtonLabel}
            />
            </div>}>

                <TextField
                    floatingLabelText="Search by title"
                    style={{width: 'calc(100% - 98px)'}}
                />
                <RaisedButton
                    label="SEARCH"
                    primary={true}
                    buttonStyle={globalStyles.raisedButton}
                    style={{marginTop: 33, width: 88, float: 'right'}}
                    labelStyle={globalStyles.raisedButtonLabel}
                    //onTouchTap={this.handleSubmitClick.bind(this)}
                />

                <div style={{ minWidth: 300}}>
                    <span>
                        {polls.size} entries
                    </span>
                </div>
                <Polls polls={polls} />
            </PageBase>
        );
    }
}

export default VotingPage;
