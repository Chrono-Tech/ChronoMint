import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Paper, RaisedButton } from 'material-ui'
import withSpinner from '../hoc/withSpinner'
import Slider from '../components/common/slider'
import PageBase from './PageBase2'
import { getRewardsData, withdrawRevenue, closePeriod } from '../redux/rewards/rewards'
import globalStyles from '../styles'

const mapStateToProps = (state) => ({
  rewardsData: state.get('rewards').data,
  isFetching: state.get('rewards').isFetching,
  isFetched: state.get('rewards').isFetched
})

const mapDispatchToProps = (dispatch) => ({
  getRewardsData: () => dispatch(getRewardsData()),
  handleWithdrawRevenue: () => dispatch(withdrawRevenue()),
  handleClosePeriod: () => dispatch(closePeriod())
})

const styles = {
  ongoing: {
    color: 'orange'
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
    fontSize: 13
  }
}

const ongoingStatusBlock = (daysPassed, periodLength) => (
  <div style={styles.statusBlock}>
    <div style={styles.ongoing}>
      ONGOING<br />
    </div>
    <Slider value={periodLength ? (daysPassed / periodLength).toFixed(2) : 1} />
  </div>
)

const closedStatusBlock = (
  <div style={styles.statusBlock}>
    <div style={styles.closed}>
      CLOSED
    </div>
  </div>
)

@connect(mapStateToProps, mapDispatchToProps)
@withSpinner
class RewardsPage extends Component {
  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getRewardsData()
    }
  }

  handleRefresh = () => {
    this.props.getRewardsData()
  }

  render () {
    const data = this.props.rewardsData
    const assetBalance = item => {
      return item.index() === data.lastPeriodIndex()
        ? data.currentAccumulated() // ongoing
        : item.assetBalance()
    }
    return (
      <PageBase title={<h3 style={globalStyles.title2}>Rewards</h3>}>
        <div style={globalStyles.description}>
          Rewards smart contract address: {data.address}<br />
          Current rewards period: {data.lastPeriodIndex()}<br />
          Period length: {data.periodLength()} days<br /><br />

          My TIME deposit: {data.accountDeposit()} TIME<br />
          My current revenue available for withdrawal: {data.accountRewards()} LHT<br /><br />

          <RaisedButton
            label='Refresh'
            onTouchTap={this.props.handleRefresh}
            buttonStyle={{...styles.raisedButton}}
            labelStyle={styles.raisedButtonLabel}
          />&nbsp;&nbsp;
          {data.accountRewards() ? <RaisedButton
            label='Withdraw Revenue'
            primary
            onTouchTap={this.props.handleWithdrawRevenue}
            buttonStyle={{...styles.raisedButton}}
            labelStyle={styles.raisedButtonLabel}
          /> : ''}
        </div>

        {data.periods.valueSeq().map(item =>
          <Paper key={item.index()} style={globalStyles.item.paper}>
            <h2 style={globalStyles.item.title}>Rewards period #{item.index()}</h2>

            {item.index() === data.lastPeriodIndex()
              ? ongoingStatusBlock(item.daysPassed(), data.periodLength())
              : closedStatusBlock}

            <div style={globalStyles.item.greyText}>
              Start date: {item.startDate()}<br />
              End date: {item.endDate()} (in {item.daysRemaining()} days)<br />

              Total TIME tokens deposited: {item.totalDeposit()} TIME (
              {item.totalDepositPercent(data.timeTotalSupply())}% of total count)<br />
              Unique shareholders: {item.uniqueShareholders()}<br />
              Dividends accumulated for period:&nbsp;
              {assetBalance(item)} LHT<br /><br />

              Your TIME tokens eligible for rewards in the period: {item.userDeposit()} TIME
              ({item.userDepositPercent()}% of total deposited amount)<br />
              Your revenue accumulated for period:&nbsp;
              {item.userRevenue(assetBalance(item))} LHT<br />

              {item.isClosable() ? <RaisedButton
                label='Close Period'
                primary
                onTouchTap={this.props.handleClosePeriod}
                style={{marginTop: 23, marginBottom: 25}}
                buttonStyle={{...styles.raisedButton}}
                labelStyle={styles.raisedButtonLabel}
              /> : <p>&nbsp;</p>}
            </div>
          </Paper>
        )}
      </PageBase>
    )
  }
}

export default RewardsPage
