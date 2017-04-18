import React from 'react'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import {white} from 'material-ui/styles/colors'
import {BarChart, Bar, ResponsiveContainer, XAxis} from 'recharts'
import GlobalStyles from '../../../styles'

const MonthlySales = (props) => {
  const styles = {
    paper: {
      backgroundColor: '#4a8fb9',
      height: 150
    },
    div: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '95%',
      height: 85
    },
    header: {
      color: white,
      backgroundColor: '#17579c',
      padding: 10
    }
  }

  return (
    <Paper style={styles.paper}>
      <div style={{...GlobalStyles.title, ...styles.header}}>Monthly Sales (inactive)</div>
      <div style={styles.div}>
        <ResponsiveContainer>
          <BarChart data={props.data}>
            <Bar dataKey='uv' fill='#e2a864' />
            <XAxis dataKey='name' stroke='none' tick={{fill: white}} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Paper>
  )
}

MonthlySales.propTypes = {
  data: PropTypes.array
}

export default MonthlySales
