import React, { Component } from 'react'
import Assessment from 'material-ui/svg-icons/action/assessment'
import {
  TokenUsage,
  InfoBox,
  MonthlySales,
  NewContracts,
  LOCsList,
  TotalLHT,
  TotalLOCs,
  TotalMembers
} from '../components/pages/DashboardPage'
import globalStyles from '../styles'
import ExpandMore from 'material-ui/svg-icons/navigation/expand-more'
import ExpandLess from 'material-ui/svg-icons/navigation/expand-less'
import ChevronRight from 'material-ui/svg-icons/navigation/chevron-right'

const fixtureData = {
  monthlySales: [
    {name: 'Jan', uv: 3700},
    {name: 'Feb', uv: 3000},
    {name: 'Mar', uv: 2000},
    {name: 'Apr', uv: 2780},
    {name: 'May', uv: 2000},
    {name: 'Jun', uv: 1800},
    {name: 'Jul', uv: 2600},
    {name: 'Aug', uv: 2900},
    {name: 'Sep', uv: 3500},
    {name: 'Oct', uv: 3000},
    {name: 'Nov', uv: 2400},
    {name: 'Dec', uv: 2780}
  ],
  newOrders: [
    {pv: 2400},
    {pv: 1398},
    {pv: 9800},
    {pv: 3908},
    {pv: 4800},
    {pv: 3490},
    {pv: 4300}
  ],
  browserUsage: [
    {name: 'LOC 1', value: 800, color: '#161240', icon: <ExpandMore />},
    {name: 'LOC 2', value: 300, color: '#17579c', icon: <ChevronRight />},
    {name: 'LOC 3', value: 300, color: '#4a8fb9', icon: <ExpandLess />}
  ]
}

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
              value={<span>inactive</span>}
            />
          </div>
          <div className='col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 '>
            <TotalMembers />
          </div>
        </div>
        <div className='row' key='secRow'>
          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15'>
            <NewContracts data={fixtureData.newOrders} />
          </div>

          <div className='col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15'>
            <MonthlySales data={fixtureData.monthlySales} />
          </div>
        </div>
        <div className='row' key='thirdRow'>
          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 '>
            <LOCsList />
          </div>

          <div className='col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 '>
            <TokenUsage data={fixtureData.browserUsage} />
          </div>
        </div>
      </div>
    )
  }
}

export default DashboardPage
