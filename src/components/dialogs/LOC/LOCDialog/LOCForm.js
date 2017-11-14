import BigNumber from 'bignumber.js'
import { DatePicker, TextField } from 'redux-form-material-ui'
import { Field, reduxForm } from 'redux-form/immutable'
import { FlatButton, RaisedButton } from 'material-ui'
import { I18n, Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import LOCModel from 'models/LOCModel'
import { addLOC, removeLOC, updateLOC } from 'redux/locs/actions'
import FileSelect from 'components/common/FileSelect/FileSelect'
import validate from './validate'

import './LOCForm.scss'

const mapStateToProps = (state) => ({
  locs: state.get('locs').locs,
})

const mapDispatchToProps = (dispatch) => ({
  addLOC: (loc: LOCModel) => dispatch(addLOC(loc)),
  updateLOC: (loc: LOCModel) => dispatch(updateLOC(loc)),
  removeLOC: (loc: LOCModel) => dispatch(removeLOC(loc)),
})

const onSubmit = (values, dispatch, props) => new LOCModel({
  ...props.initialValues.toJS(),
  ...values.toJS(),
  oldName: props.initialValues.get('name'),
  issueLimit: new BigNumber(values.get('issueLimit')),
  expDate: values.get('expDate').getTime(),
  token: props.loc.token(),
})

@connect(mapStateToProps, mapDispatchToProps)
@reduxForm({ form: 'LOCForm', validate, onSubmit })
class LOCForm extends PureComponent {
  static propTypes = {
    removeLOC: PropTypes.func,
    pristine: PropTypes.bool,
    onDelete: PropTypes.func,
    initialValues: PropTypes.object,
    handleSubmit: PropTypes.func,
    loc: PropTypes.object,
  }

  handleDeleteClick () {
    this.props.onDelete()
    this.props.removeLOC(this.props.loc)
  }

  render () {
    const {
      handleSubmit, initialValues, loc, pristine,
    } = this.props
    const isNew = loc.get('isNew')

    return (
      <form onSubmit={handleSubmit} styleName='root'>
        <p><Translate value='forms.mustBeCoSigned' /></p>

        <div styleName='row'>
          <div styleName='col'>
            <Field
              component={TextField}
              name='name'
              fullWidth
              floatingLabelText={<Translate value='locs.title' />}
            />
            <Field
              component={TextField}
              name='website'
              hintText='http://...'
              fullWidth
              floatingLabelText={<Translate value='terms.website' />}
            />

            <Field
              component={DatePicker}
              name='expDate'
              fullWidth
              hintText={<Translate value='locs.expirationDate' />}
              floatingLabelText={<Translate value='locs.expirationDate' />}
            />
          </div>
          <div styleName='col'>
            <h3 styleName='subHeader'><Translate value='locs.issuanceParameters' /></h3>
            <Field
              component={TextField}
              name='issueLimit'
              type='number'
              fullWidth
              floatingLabelText={(
                <Translate
                  value='locs.forms.amountToBeS'
                  action={I18n.t('locs.forms.actions.issued')}
                />
              )}
            />
          </div>
        </div>

        <div styleName='footer'>
          <div styleName='row'>
            <div styleName='col'>
              <Field
                component={FileSelect}
                name='publishedHash'
                value={initialValues.get('publishedHash')}
                fullWidth
                multiple
              />
            </div>
            <div styleName='col actions'>
              {!isNew && (
                <div styleName='action'>
                  <FlatButton
                    label={<Translate value='locs.delete' />}
                    onTouchTap={() => this.handleDeleteClick()}
                  />
                </div>
              )}
              <div styleName='action'>
                <RaisedButton
                  label={<Translate value={isNew ? 'locs.create' : 'terms.save'} />}
                  primary
                  onTouchTap={handleSubmit}
                  disabled={pristine}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default LOCForm
