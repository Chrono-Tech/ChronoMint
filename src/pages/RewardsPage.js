import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FlatButton, Paper} from 'material-ui';

import withSpinner from '../hoc/withSpinner';
import Slider from '../components/common/slider';
import PageBase from './PageBase2';

import {showRewardsEnablingModal} from '../redux/ducks/ui/modal';
import {getPeriodData} from '../redux/ducks/rewards/data';

import globalStyles from '../styles';

const mapStateToProps = (state) => ({
    rewardsData: state.get('rewardsData'),
    isFetching: state.get('rewardsCommunication').isFetching,
    account: state.get('sessionData').account
});

const mapDispatchToProps = (dispatch) => ({
    showRewardsEnablingModal: () => dispatch(showRewardsEnablingModal()),
    getPeriodData: (address, periodId) => dispatch(getPeriodData(address, periodId))
});

const styles = {
    ongoing: {
        color: 'orange',
    },
    closed: {
        color: 'green'
    },
    statusBlock: {
        textAlign: 'right',
        float: 'right',
        width: 130,
        marginLeft: 10,
        marginBottom: 10,
        padding: 0,
        fontSize: 13,
    }
};

const ongoingStatusBlock = (daysPassed, periodLength) => (
    <div style={styles.statusBlock}>
        <div style={styles.ongoing}>
            ONGOING<br/>
        </div>
            <Slider value={daysPassed/periodLength}/>
    </div>
);

const closedStatusBlock = (
    <div style={styles.statusBlock}>
        <div style={styles.closed}>
            CLOSED
        </div>
    </div>
);

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class RewardsPage extends Component {

    componentWillMount() {
        const {getPeriodData, rewardsData, account} = this.props;
        getPeriodData(account, rewardsData.lastPeriod);
        rewardsData.lastClosedPeriod && getPeriodData(account, rewardsData.lastClosedPeriod);
    }

    render() {
        const {showRewardsEnablingModal, rewardsData} = this.props;
        return (
            <PageBase title={<span>Rewards</span>}>
                <div style={globalStyles.description}>
                    Rewards smart contract address: {rewardsData.address}<br/>
                    Current rewards period: {rewardsData.lastPeriodIndex()}<br/>
                    Period length: {rewardsData.getPeriodLength()} days<br/>

                    Total TIME deposit: {rewardsData.getTotalDeposit()} TIME<br/>
                    My TIME deposit: {rewardsData.getAccountDeposit()} TIME<br/>
                </div>

                {rewardsData.periods.valueSeq().map(item =>

                <Paper key={item.getId()} style={globalStyles.item.paper}>
                    <h2 style={globalStyles.item.title}>Rewards period #{item.getId()}</h2>
                    <div style={globalStyles.item.greyText}>
                        Start date: {item.getStartDate()}<br/>
                        End date: {item.getEndDate(rewardsData.getPeriodLength())}<br/>
                        <br/>

                        {item.getId() === rewardsData.lastPeriodIndex()
                            ? ongoingStatusBlock(item.getDaysPassed(), rewardsData.getPeriodLength()) : closedStatusBlock}

                        TIME tokens deposited: {item.getTotalDeposit()} TIME<br/>
                        Your TIME tokens eligible for rewards in the period: {item.getCurrentUserDeposit()} TIME

                        <p>
                            <FlatButton label="DEPOSIT TIME TOKENS" labelStyle={globalStyles.grayButtonLabel}
                                        onTouchTap={showRewardsEnablingModal}/>
                        </p>
                    </div>
                </Paper>
                )}
            </PageBase>
        );
    }
}

export default RewardsPage;
