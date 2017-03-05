import React, {Component} from 'react';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import PageBase from '../pages/PageBase2';
import globalStyles from '../styles';
import {loadLoc} from '../redux/ducks/locs/loc';
import {showPollModal} from '../redux/ducks/ui/modal';
// import {dateFormatOptions} from '../config';
import {getPollsOnce, supportPoll, declinePoll} from '../redux/ducks/polls/data';

const OngoingStatusBlock = <div style={globalStyles.item.status.block}>
        <div style={globalStyles.item.status.orange}>
            ONGOING<br/>
        </div>
    </div>;

const closedStatusBlock = <div style={globalStyles.item.status.block}>
    <div style={globalStyles.item.status.red}>
        DECLINED<br/>
    </div>
</div>;

const mapStateToProps = (state) => ({
    polls: state.get('polls'),
});

const mapDispatchToProps = (dispatch) => ({
    showPollModal: pollKey => dispatch(showPollModal(pollKey)),
    getPollsOnce: () => dispatch(getPollsOnce()),
    loadLoc: loc => dispatch(loadLoc(loc)),
});

@connect(mapStateToProps, mapDispatchToProps)
class VotingPage extends Component {

    handleShowPollModal = (pollKey) => {
        this.props.loadLoc(pollKey);
        this.props.showPollModal({pollKey});
    };

    handleSupport = (pollKey) => {
        supportPoll({pollKey}).then(r => alert(r));
    };

    handleDecline = (pollKey) => {
        declinePoll({pollKey}).then(r => alert(r));
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
                onTouchTap={this.handleShowPollModal.bind(null, null)}
                buttonStyle={{...globalStyles.raisedButton, }}
                labelStyle={globalStyles.raisedButtonLabel}
            />
            </div>}>

                <TextField
                    floatingLabelText="Search by title"
                    style={{width: 'calc(100% - 98px)'}}
                    //fullWidth={true}
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

                {polls.map( (item, key) => {
                    return (
                        <Paper key={key} style={globalStyles.item.paper}>
                            <div>
                                {key > 0 ? OngoingStatusBlock : closedStatusBlock}{/* todo */}
                                <div style={globalStyles.item.title}>{item.pollTitle()}</div>
                                <div style={globalStyles.item.greyText}>
                                    Description
                                </div>
                                <div style={globalStyles.item.lightGrey}>
                                    Published 13 hours ago. {
                                    6} days left. {23}% TIME holders already voted.
                                </div>
                            </div>
                            <div>
                                <FlatButton label="Support" style={{color: 'grey'}}
                                            onTouchTap={this.handleSupport.bind(null, key)}
                                />
                                <FlatButton label="Decline" style={{color: 'grey'}}
                                            onTouchTap={this.handleDecline.bind(null, key)}
                                />
                                <FlatButton label="Results" style={{color: 'grey'}}
                                            onTouchTap={this.handleShowPollModal.bind(null, key)}
                                />
                            </div>
                        </Paper>
                    )
                }).toArray()}
            </PageBase>
        );
    }
}

export default VotingPage;
