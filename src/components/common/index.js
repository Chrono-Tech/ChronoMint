import React, {Component, PropTypes} from 'react'
import cx from 'classnames'
import moment from 'moment'

export class ProgressButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      busy: false,
      onClicked: this.getInternalOnClick(props)
    }
  }

  // this is required to prevent warnings when the clickHandler attempts to call
  // setState and the component has already been unmounted
  mounted: false

  componentWillMount () {
    this.mounted = true
  }

  componentWillUnmount () {
    this.mounted = false
  }

  getInternalOnClick (props) {
    const component = this
    const onClickFromProps = props.onClick
    const unsetState = () => {
      if (this.mounted === true) {
        component.setState({busy: false})
      }
    }
    return function internalOnClick (e) {
      if (onClickFromProps) {
        const p = onClickFromProps(e)
        if (p && p.then && p.catch) {
          component.setState({busy: true})
          p.then(unsetState).catch(unsetState)
        }
      }
    }
  }

  render () {
    const props = this.props
    const {busy, onClicked} = this.state
    const cls = cx('button button--progress', props.variant, {'busy': busy || props.busy})
    return (
      <button className={cls} {...props} onClick={onClicked}>{props.children}</button>
    )
  }
}

export class EditButton extends Component {
  render () {
    return (
      <div className='editable-panel__actions-top'>
        <ProgressButton variant='button--flat' {...this.props}>Edit</ProgressButton>
      </div>
    )
  }
}

export class CancelButton extends Component {
  render () {
    return (
      <div className='editable-panel__actions-top'>
        <ProgressButton variant='button--flat button--cancel' {...this.props}>Cancel</ProgressButton>
      </div>
    )
  }
}

export class SaveButton extends Component {
  render () {
    return (
      <ProgressButton variant='button--secondary' {...this.props}>Save Changes</ProgressButton>
    )
  }
}

export const LastUpdated = ({lastUpdated}) => (
  <div className='editable-panel__info-top'>
    <div
      className='last-modified'>{lastUpdated ? 'Last Updated ' + moment(lastUpdated).format('Do MMM YYYY, hh:mm') : 'New'}</div>
  </div>
)

export const ConfirmToggle = ({isComplete, func}) => (
  <div className='form-actions'>
    <div className='form-actions__secondary'>
      <button className='button button--flat button--cancel'
        onClick={() => {
          func()
        }}>{isComplete ? 'Confirmed' : 'Confirm'}</button>
    </div>
  </div>
)

ConfirmToggle.propTypes = {
  isComplete: PropTypes.bool.isRequired,
  func: PropTypes.func.isRequired
}
