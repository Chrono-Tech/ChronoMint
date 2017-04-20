import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Paper} from 'material-ui'
import styles from '../styles'

const mapStateToProps = (state) => ({
  list: state.get('notifier').list
})

@connect(mapStateToProps, null)
class NoticesPage extends Component {
  render () {
    const list = this.props.list.entrySeq()
    return (
      <div>
        <span style={styles.navigation}>ChronoMint / Notices</span>

        {list.size > 0 ? (<div>
          {list.sortBy(x => x[1].time()).reverse().valueSeq().map(([index, item]) =>
            <div key={index}>
              <Paper style={styles.paper}>
                {item.fullHistoryBlock()}
              </Paper>
              <div style={styles.paperSpace} />
            </div>
          )}
        </div>) : (<Paper style={styles.paper}>No notifications.</Paper>)}
      </div>
    )
  }
}

export default NoticesPage
