import React from 'react'
import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { FlatButton, FloatingActionButton } from 'material-ui'
import { TextField } from 'redux-form-material-ui'
import { Field, reduxForm, formPropTypes } from 'redux-form/immutable'
import { modalsClose } from 'redux/modals/actions'
import classnames from 'classnames'
import { addManager, DUCK_ASSETS_MANAGER, removeManager } from 'redux/assetsManager/actions'
import { DUCK_SESSION } from 'redux/session/actions'
import validate from './validate'
import './EditManagersBaseForm.scss'

export const FORM_ASSET_MANAGER = 'AssetManagerDialog'

function prefix (token) {
  return 'Assets.AssetManagerForm.' + token
}

function mapStateToProps (state) {
  const {selectedToken, tokensMap} = state.get(DUCK_ASSETS_MANAGER)
  return {
    selectedToken,
    account: state.get(DUCK_SESSION).account,
    tokensMap,
  }
}

const onSubmit = (values, dispatch, props) => {
  dispatch(addManager(props.tokensMap.get(props.selectedToken), values.get('managerAddress')))
}

function mapDispatchToProps (dispatch) {
  return {
    onClose: () => dispatch(modalsClose()),
    handleRemoveManager: (token, manager) => {
      dispatch(removeManager(token, manager))
    },
  }
}

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({form: FORM_ASSET_MANAGER, validate, onSubmit})
export default class EditManagersBase extends React.Component {
  static propTypes = {
    account: PropTypes.string,
    onClose: PropTypes.func,
    handleAddManager: PropTypes.func,
    handleRemoveManager: PropTypes.func,
    selectedToken: PropTypes.string,
    tokensMap: PropTypes.object,
  } & formPropTypes

  renderManagersList () {
    const selectedToken = this.props.tokensMap.get(this.props.selectedToken)
    return (
      <div styleName='managersList'>
        <div
          styleName='managersListFieldRow'
        >
          <div styleName='managersListFieldAddress'>
            <div styleName={classnames('managersListIcon', 'xs-hide')}>
              <i className='material-icons'>account_circle</i>
            </div>
            <Field
              styleName='managerAddress'
              component={TextField}
              name='managerAddress'
              fullWidth
              hintText={<Translate value={prefix('managerAddress')} />}
            />
          </div>
          <div styleName='managersListAction'>
            <FlatButton
              type='submit'
              styleName='addManagerButton'
              label={<Translate value={prefix('addManagersButton')} />}
            />
          </div>
        </div>
        {
          (selectedToken.managersList() || []).map(
            item => (
              <div key={item} styleName='managersListRow'>
                <div styleName='managersListAddress'>
                  <div styleName='managersListIcon'>
                    <i className='material-icons'>account_circle</i>
                  </div>
                  <div styleName='ellipsis'>
                    <div>{item}</div>
                  </div>
                </div>
                {
                  this.props.account !== item &&
                  <div
                    onTouchTap={() => {
                      this.props.onClose()
                      this.props.handleRemoveManager(selectedToken, item)
                    }}
                    styleName='managersListAction'
                  >
                    <i className='material-icons'>delete</i>
                  </div>
                }
              </div>
            )
          )
        }
      </div>)

  }

  render () {
    return (
      <form styleName='content' onSubmit={this.props.handleSubmit}>
        <div styleName='header'><Translate value={prefix('dialogTitle')} /></div>
        <div styleName='dialogBody'>
          {this.renderManagersList()}
        </div>
      </form>
    )
  }
}
