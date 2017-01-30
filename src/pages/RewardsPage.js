import React, {Component} from 'react';
import Divider from 'material-ui/Divider';
import PageBase from './PageBase2';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {showrewardsEnablingModal} from 'redux/ducks/modal';
import {connect} from 'react-redux';
import globalStyles from '../styles';
import Slider from 'components/common/slider';

const mapDispatchToProps = (dispatch) => ({
    showrewardsEnablingModal: () => dispatch(showrewardsEnablingModal())
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

const fakeData = {
    rewardsContractAddress: '0x9e3338cd3424bf07f143570e2afa009ff079e54b',
    currentPeriod: 3,
    periodLength: 90,
    accessOfRewardsContract: 'ENABLED',
    totalTokens: 88467,
    rewardsPeriods: [
        {
            periodNumber: 3,
            startDate: new Date("February 21 2017"),
            endDate: new Date("May 19 2017"),
            tokensDeposited: 68120,
            shareholders: 45713,
            dividendsUS: 1212.12938192,
            dividendsEU: 712.17386544,
            dividendsAU: 34551.56498,
            rewardsTokens: 1712,
        },
        {
            periodNumber: 2,
            startDate: new Date("November 23 2016"),
            endDate: new Date("February 21 2017"),
            tokensDeposited: 63111,
            shareholders: 41200,
            dividendsUS: 2320.46235776,
            dividendsEU: 970.88875436,
            dividendsAU: 48200.76354345,
            rewardsTokens: 1712,
        }
    ]
};


const ongoingStatusBlock = <div style={styles.statusBlock}>
        <div style={styles.ongoing}>
            ONGOING<br/>
        </div>
            <Slider value={60}/>
    </div>;

const closedStatusBlock = <div style={styles.statusBlock}>
    <div style={styles.closed}>
        CLOSED
    </div>
</div>;

const dateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
};

@connect(null, mapDispatchToProps)
class RewardsPage extends Component {
    render() {
        const {showrewardsEnablingModal} = this.props;
        return (
            <PageBase title={<span>Rewards</span>}>
                <div style={globalStyles.description}>
                    Rewards smart contract address: {fakeData.rewardsContractAddress}<br/>
                    Current rewards period: {fakeData.currentPeriod}<br/>
                    Period length: {fakeData.periodLength} days<br/>
                    <br/>
                    Access of Rewards contract is: {fakeData.accessOfRewardsContract}
                </div>
                <FlatButton label="DISABLE ACCESS" onTouchTap={showrewardsEnablingModal} style={globalStyles.cyanButton} labelStyle={globalStyles.cyanButtonLabel} /><br/>
                <FlatButton label="HOW IT WORKS" onTouchTap={showrewardsEnablingModal} style={globalStyles.cyanButton} labelStyle={globalStyles.cyanButtonLabel} />
                {fakeData.rewardsPeriods.map(item =>
                <div key={item.periodNumber}>
                    <div style={globalStyles.itemBlock}>
                        <h2 style={globalStyles.itemTitle}>Rewards period #{item.periodNumber}</h2>
                        <div style={globalStyles.itemGreyText}>
                            {item.periodNumber === fakeData.currentPeriod ? ongoingStatusBlock : closedStatusBlock}
                            Start date: {item.startDate.toLocaleDateString("en-us", dateFormatOptions)}<br/>
                            End date: {item.endDate.toLocaleDateString(undefined, dateFormatOptions)}<br/>
                            Total TIME tokens deposited: {item.tokensDeposited} TIME
                                ({(item.tokensDeposited * 100 / fakeData.totalTokens).toFixed(0)}%
                                of total deposited amount<br/>
                            Unique shareholders: {item.shareholders}<br/>
                            Dividends accumulated for period: {
                            item.dividendsUS} LHUS, {
                            item.dividendsEU} LHEU, {
                            item.dividendsAU} LHAU<br/>
                            <br/>
                            Your TIME tokens eligible for rewards in the period: {item.rewardsTokens} TIME
                                ({(item.rewardsTokens * 100 / item.tokensDeposited).toFixed(9)}%
                                of total deposited amount)<br/>
                            Your approximate revenue for period: {
                                (item.dividendsUS * item.rewardsTokens
                                    / item.tokensDeposited).toFixed(8)} LHUS, {
                                (item.dividendsEU * item.rewardsTokens
                                    / item.tokensDeposited).toFixed(8)} LHEU, {
                                (item.dividendsAU * item.rewardsTokens
                                    / item.tokensDeposited).toFixed(8)} LHAU
                            <p>
                                <FlatButton label="WITHDRAW TIME TOKENS" labelStyle={globalStyles.grayButtonLabel} onTouchTap={showrewardsEnablingModal}/>
                            </p>
                        </div>
                    </div>
                    <Divider style={globalStyles.itemsDivider}/>
                </div>
                )}
            </PageBase>
        );
    }
}

export default RewardsPage;
