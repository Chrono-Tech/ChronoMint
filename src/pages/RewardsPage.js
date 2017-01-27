import React, {Component} from 'react';
import Divider from 'material-ui/Divider';
import PageBase from './PageBase';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {showrewardsEnablingModal} from 'redux/ducks/modal';
import {connect} from 'react-redux';

const mapDispatchToProps = (dispatch) => ({
    showrewardsEnablingModal: () => dispatch(showrewardsEnablingModal())
});

const styles = {
    div: {
        padding: 20
    },
    periodTitle: {
        fontSize: 20
    },
    gray: {
        color: 'gray',
        fontSize: 12
    },
    ongoing: {
        color: 'orange'
    },
    closed: {
        color: 'green'
    },
    statusBlock: {
        textAlign: 'right'
    }
};

const muiTheme = getMuiTheme({
    slider: {
        selectionColor: 'red'
    },
});

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

const ongoingStatusBlock = <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 " style={styles.statusBlock}>
        <div style={styles.ongoing}>
            ONGOING<br/>
            {61}%
        </div>
        <div style={{pointerEvents: 'none'}}>
            <MuiThemeProvider muiTheme={muiTheme}>
                <Slider value={0.61} disabled={false} />
            </MuiThemeProvider>
        </div>
    </div>;

const closedStatusBlock = <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 " style={styles.statusBlock}>
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
            <PageBase title="Rewards" navigation="ChronoMint / Rewards">
                <b>
                    <p/>
                    <p>
                        Rewards smart contract address: {fakeData.rewardsContractAddress}<br/>
                        Current rewards period: {fakeData.currentPeriod}<br/>
                        Period length: {fakeData.periodLength} days
                    </p>
                    Access of Rewards contract is: {fakeData.accessOfRewardsContract}<br/>
                </b>
                <div>
                    <FlatButton label="DISABLE ACCESS" primary={true} />
                </div>
                <div>
                    <FlatButton label="HOW IT WORKS" primary={true} />
                </div>
                {fakeData.rewardsPeriods.map(item =>
                    <div style={styles.div} key={item.periodNumber}>
                        <div className="row">
                            <div className="col-xs-36 col-sm-18 col-md-9 col-lg-9 m-b-45 ">
                                <h2 style={styles.periodTitle}>Rewards period #{item.periodNumber}</h2>
                                <div style={styles.gray}>
                                    Start date: {item.startDate.toLocaleDateString("en-us", dateFormatOptions)}<br/>
                                    End date: {item.endDate.toLocaleDateString(undefined, dateFormatOptions)}<br/>
                                    Total TIME tokens deposited: {item.tokensDeposited} TIME
                                        ({(item.tokensDeposited * 100 / fakeData.totalTokens).toFixed(0)}%
                                        of total deposited amount<br/>
                                    Unique shareholders: {item.shareholders}
                                </div>
                            </div>
                            {item.periodNumber === fakeData.currentPeriod ? ongoingStatusBlock : closedStatusBlock}
                        </div>
                        <div style={styles.gray}>
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
                                <FlatButton label="WITHDRAW TIME TOKENS" onTouchTap={showrewardsEnablingModal}/>
                            </p>
                        </div>
                        <Divider/>
                    </div>
                )}
            </PageBase>
        );
    }
}

export default RewardsPage;
