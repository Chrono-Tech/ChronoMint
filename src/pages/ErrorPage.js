import React from 'react'
import Paper from 'material-ui/Paper'
import globalStyles from '../styles'

const styles = {
  paper: {
    padding: '50px',
    marginTop: '50px'
  }
}

export default (props) => {
  return (
    <div className='page-base'>
      <div>Error</div>
      {console.error(props.error)}
      <div style={globalStyles.description}>
        Something went wrong. Please try again later or contact with administrator.
      </div>
      <Paper style={styles.paper}>
        <div>
          {props.error.message}
        </div>
      </Paper>
    </div>
  )
}
