import React, {Component} from 'react'
import Assessment from 'material-ui/svg-icons/action/assessment'
import Face from 'material-ui/svg-icons/action/face'
import {
  TokenUsage,
  InfoBox,
  MonthlySales,
  NewContracts,
  LOCsList,
  TotalLHT,
  TotalLOCs
} from '../components/pages/DashboardPage'
import Data from '../data'
import globalStyles from '../styles'

class DashboardPage extends Component {
  render () {
    return (
      <div>
        <span style={globalStyles.navigation}>ChronoMint / CBE Dashboard</span>
        <div className='row' key='firstRow'>
          <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 '>
            <TotalLHT />
          </div>
          <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 '>
            <TotalLOCs />
          </div>
          <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 '>
            <InfoBox Icon={Assessment}
              color='#4a8fb9'
              title='Sales'
              value='460'
            />
          </div>
          <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 '>
            <InfoBox Icon={Face}
              color='#e2a864'
              title='New Members'
              value='2'
            />
          </div>
        </div>
        <div className='row' key='secRow'>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15'>
            <NewContracts data={Data.dashBoardPage.newOrders} />
          </div>

          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15'>
            <MonthlySales data={Data.dashBoardPage.monthlySales} />
          </div>
        </div>
        <div className='row' key='thirdRow'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 '>
            <LOCsList />
          </div>

          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 '>
            <TokenUsage data={Data.dashBoardPage.browserUsage} />
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardPage
