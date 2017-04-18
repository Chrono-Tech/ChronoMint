import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import {white} from 'material-ui/styles/colors'
import {LineChart, Line, ResponsiveContainer} from 'recharts'
import {typography} from 'material-ui/styles'

const NewOrders = (props) => {
  const styles = {
    paper: {
      backgroundColor: '#4a8fb9',
      height: 150
    },
    div: {
      height: 95,
      padding: '5px 15px 0 15px'
    },
    header: {
      fontSize: 24,
      fontWeight: typography.fontWeightLight,
      color: white,
      backgroundColor: '#17579c',
      padding: 10
    }
  }

  return (
    <Paper style={styles.paper}>
      <div style={{...styles.header}}>New Contracts (inactive)</div>
      <div style={styles.div}>
        <ResponsiveContainer >
          <LineChart data={props.data}>
            <Line type='monotone' dataKey='pv' stroke='#e2a864' strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  )
}

NewOrders.propTypes = {
  data: PropTypes.array
}

export default NewOrders
