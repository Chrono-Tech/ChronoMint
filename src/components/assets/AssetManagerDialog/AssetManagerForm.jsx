import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, FloatingActionButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import './AssetManagerForm.scss'
import validate from './validate'
import classnames from 'classnames'

function prefix (token) {
  return 'Assets.AssetManagerForm.' + token
}

let managersList = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const FORM_ASSET_MANAGER = 'AssetManagerDialog'

function mapStateToProps (state) {
  const form = state.get('form')
  return {
    formValues: form.get(FORM_ASSET_MANAGER) && form.get(FORM_ASSET_MANAGER).get('values')
  }
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    onSubmit: () => {
      dispatch(modalsClose())
    },
    handleAddManager: () => {
    },
    handleRemoveManager: () => {
    }

  }
}

const onSubmit = (/*values, dispatch*/) => {
  // dispatch(createPlatform(values))
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: FORM_ASSET_MANAGER, validate, onSubmit})
export default class AssetManagerForm extends React.Component {
  static propTypes = {
    handleSubmit: PropTypes.func,
    onClose: PropTypes.func,
    formValues: PropTypes.object,
    handleAddManager: PropTypes.func,
    handleRemoveManager: PropTypes.func
  }

  constructor () {
    super(...arguments)

    this.state = {
      selectedManagers: {}
    }
  }

  handleSelectManager (managerAddress) {
    const selectedManagers = {...this.state.selectedManagers}
    selectedManagers[managerAddress] = !selectedManagers[managerAddress]
    this.setState({selectedManagers})
  }

  renderManagersList () {
    const {selectedManagers} = this.state
    return <div styleName='managersList'>
      <div
        styleName='managersListFieldRow'>
        <div styleName='managersListFieldAddress'>
          <div styleName={classnames('managersListIcon', 'xs-hide')}>
            <i className='material-icons'>account_circle</i>
          </div>
          <Field
            styleName='managerAddress'
            component={TextField}
            name='managerAddress'
            fullWidth
            hintText={<Translate value={prefix('managerAddress')} />} />
        </div>
        <div styleName='managersListAction'>
          <FloatingActionButton
            mini
            styleName={classnames('addManagerButton', 'xs-show')}
            onTouchTap={() => {
            }}>
            <i className='material-icons'>add</i>
          </FloatingActionButton>
          <FlatButton
            onTouchTap={() => this.props.handleAddManager()}
            styleName={classnames('addManagerButton', 'xs-hide')}
            label={<Translate value={prefix('addManagersButton')} />}
          />
        </div>
      </div>
      {
        managersList.map(
          item => (
            <div key={item} styleName={classnames('managersListRow', {'selected': selectedManagers[item]})}>
              <div
                onTouchTap={() => this.handleSelectManager(item)}
                styleName='managersListAddress'>
                <div styleName='managersListIcon'>
                  <i className='material-icons'>account_circle</i>
                </div>
                <div styleName='ellipsis'>
                  <div>
                    0x9876f6477iocc4757q22dfg3333nmk1111v234x0
                  </div>
                </div>
              </div>
              <div onTouchTap={() => this.props.handleRemoveManager(item)} styleName='managersListAction'>
                <i className='material-icons'>delete</i>
              </div>
            </div>
          )
        )
      }

    </div>

  }

  render () {
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='dialogHeader'>
          <div styleName='dialogHeaderStuff'>
            <div styleName='dialogHeaderTitle'>
              <Translate value={prefix('dialogTitle')} />
            </div>
          </div>
        </div>
        <div styleName='dialogBody'>
          {this.renderManagersList()}
        </div>
      </form>
    )
  }
}
