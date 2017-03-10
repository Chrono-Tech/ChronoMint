import React, {Component} from 'react';
import {connect} from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import globalStyles from '../../../styles';
import PollOptions from './PollOptions';
import { showPollModal} from '../../../redux/ducks/ui/modal';
import {passPollIndex} from '../../../redux/ducks/polls/poll';

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

const mapDispatchToProps = (dispatch) => ({
    showPollModal: pollKey => dispatch(showPollModal(pollKey)),
    loadPoll: index => dispatch(passPollIndex(index)),
});

@connect(null, mapDispatchToProps)
class Polls extends Component {

    handleShowPollModal = (pollKey) => {
        this.props.loadPoll(pollKey);
        this.props.showPollModal({pollKey});
    };

    render() {
        const {polls} = this.props;
        return (
            <div>
                {polls.map(poll => {
                        let key = poll.index();
                        return (
                            <Paper key={key} style={globalStyles.item.paper}>
                                <div>
                                    {key > 0 ? OngoingStatusBlock : closedStatusBlock}{/* todo */}
                                    <div style={globalStyles.item.title}>{poll.pollTitle()}</div>
                                    <div style={globalStyles.item.greyText}>
                                        {poll.pollDescription()}
                                    </div>
                                    <PollOptions options={poll.options()}/>
                                    <div style={globalStyles.item.lightGrey}>
                                        Published 13 hours ago. {
                                        6} days left. {23}% TIME holders already voted.
                                    </div>
                                </div>
                                <div>
                                    <FlatButton label="Vote" style={{color: 'grey'}}
                                                onTouchTap={this.handleShowPollModal.bind(null, key)}
                                    />
                                    <FlatButton label="View" style={{color: 'grey'}}
                                                onTouchTap={this.handleShowPollModal.bind(null, key)}
                                    />
                                </div>
                            </Paper>
                        )
                    }
                ).toArray()
                }
            </div>
        )
    }
}

export default Polls;