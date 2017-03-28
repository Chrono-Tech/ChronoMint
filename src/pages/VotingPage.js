import React, {Component} from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import PageBase from '../pages/PageBase2';
import globalStyles from '../styles';
import {showVotingDepositModal} from '../redux/ui/modal';
import {getPolls} from '../redux/polls/data';
import {PageTitle, Polls, Search} from '../components/pages/votingPage/';

const mapStateToProps = (state) => ({
    polls: state.get('polls'),
    pollsCommunication:  state.get('pollsCommunication'),
});

const mapDispatchToProps = (dispatch) => ({
    getPolls: (account) => dispatch(getPolls(account)),
    showVotingDepositModal: () => dispatch(showVotingDepositModal()),
});

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {

    componentWillMount(){
        if (!this.props.pollsCommunication.isReady && !this.props.pollsCommunication.isFetching) {
            this.props.getPolls(localStorage.chronoBankAccount);
        }
    }

    render() {
        const {polls, showVotingDepositModal} = this.props;
        return (
            <PageBase title={<PageTitle />} >

                <Search />

                <br />
                <RaisedButton
                    label="DEPOSIT TIME TOKENS"
                    primary={true}
                    style={{marginTop: 33, marginBottom: 15}}
                    onTouchTap={showVotingDepositModal}
                    buttonStyle={{...globalStyles.raisedButton, }}
                    labelStyle={globalStyles.raisedButtonLabel}
                />

                <RaisedButton
                    label="WITHDRAWN"
                    primary={true}
                    style={{marginLeft: 22}}
                    //onTouchTap={this.handleShowNewPollModal}
                    buttonStyle={{...globalStyles.raisedButton, }}
                    labelStyle={globalStyles.raisedButtonLabel}
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
