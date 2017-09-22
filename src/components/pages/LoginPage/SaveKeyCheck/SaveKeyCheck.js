import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Checkbox } from 'material-ui'
import { setSaveKey } from '../../../../redux/sensitive/actions'
import './SaveKeyCheck.scss'

const mapStateToProps = (state) => ({
  isSaveKey: state.get('sensitive').isSaveKey
})

const mapDispatchToProps = (dispatch) => ({
  setSaveKey: (event, isSaveKey) => dispatch(setSaveKey(isSaveKey))
})

@connect(mapStateToProps, mapDispatchToProps)
export default class SaveKeyCheck extends React.Component {
  static propTypes = {
    isSaveKey: PropTypes.bool,
    setSaveKey: PropTypes.func
  }

  render () {
    return window.isMobile ?
      <div styleName='saveKey'>
        <Checkbox
          checked={this.props.isSaveKey}
          label='Save wallet on device'
          labelStyle={{ color: 'white', textAlign: 'left' }}
          onCheck={this.props.setSaveKey}
        />
      </div> :
      null
  }
}
