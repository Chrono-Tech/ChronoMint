import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ThumbUp from 'material-ui/svg-icons/action/thumb-up'
import InfoBox from './InfoBox'
import { getLOCsCounter } from '../../../redux/locs/actions'
import { CircularProgress } from 'material-ui'

const mapStateToProps = (state) => ({
  counter: state.get('locs').counter,
  isFetching: state.get('locs').isFetching
})

const mapDispatchToProps = (dispatch) => ({
  getCounter: () => dispatch(getLOCsCounter())
})

@connect(mapStateToProps, mapDispatchToProps)
class TotalLOCs extends React.Component {
  static propTypes = {
    isFetching: PropTypes.bool,
    getCounter: PropTypes.func,
    counter: PropTypes.number
  }

  componentWillMount () {
    this.props.getCounter()
  }

  render () {
    return (
      <div>
        <InfoBox
          Icon={ThumbUp} color='#17579c' title='LOCs'
          value={this.props.isFetching
            ? <CircularProgress size={24} thickness={1.5} style={{marginTop: '5px'}} />
            : <span>{this.props.counter}</span>
          }
        />
      </div>
    )
  }
}

export default TotalLOCs
