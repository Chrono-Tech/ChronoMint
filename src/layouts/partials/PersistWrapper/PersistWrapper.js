import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import spinner from 'assets/img/spinningwheel-1.gif'

import './PersistWrapper.scss'

const mapStateToProps = (state) => {
  return {
    rehydrated: state.get('persistAccount').rehydrated,
  }
}

class PersistWrapper extends React.Component {
  static propTypes = {
    rehydrated: PropTypes.bool,
  }

  static contextTypes = {
    store: PropTypes.object.isRequired,
  }

  constructor (props, context) {
    super(props, context)
    this.store = context.store
  }

  renderLoader(){
    return (
      <div styleName='loadingMessage'>
        <img src={spinner} width='24' height='24' alt='' />
      </div>
    )
  }

  render () {
    const { rehydrated, children } = this.props
    if (!rehydrated){
      return this.renderLoader()
    }

    return children
  }

}

export default connect(mapStateToProps, null)(PersistWrapper)
