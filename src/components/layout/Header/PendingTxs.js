import React, { Component } from 'react'
import { connect } from 'react-redux'
import { IconMenu, FontIcon, MenuItem } from 'material-ui'
import { white } from 'material-ui/styles/colors'

const style = {
  cursor: 'default'
}

const mapStateToProps = (state) => ({
  list: state.get('watcher').pendingTxs
})

@connect(mapStateToProps, null)
class PendingTxs extends Component {
  render () {
    const list = this.props.list.valueSeq().splice(5).sortBy(n => n.time()).reverse()
    return (
      <IconMenu color={white}
        iconButtonElement={<FontIcon className='material-icons' color={white}>alarm</FontIcon>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}>
        {list.size > 0 ? (<div>
          <MenuItem primaryText={<b>Pending transactions</b>} style={style} />
          {list.map(item =>
            <MenuItem key={item.id()} primaryText={item.historyBlock()} style={style} />
          )}
        </div>) : (<MenuItem primaryText={'No pending transactions'} style={style} />)}
      </IconMenu>
    )
  }
}

export default PendingTxs
