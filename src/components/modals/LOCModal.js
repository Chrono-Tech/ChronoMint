import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import LOCForm, { LOC_FORM_NAME } from '../forms/LOCForm/LOCForm'
import { addLOC, removeLOC, updateLOC } from '../../redux/locs/actions'
import globalStyles from '../../styles'
import { Translate } from 'react-redux-i18n'
import ModalBase from './ModalBase/ModalBase'
import { isPristine, submit } from 'redux-form/immutable'
import LOCModel2 from '../../models/LOCModel2'

const mapStateToProps = (state) => ({
  isPristine: isPristine(LOC_FORM_NAME)(state)
})

const mapDispatchToProps = (dispatch) => ({
  addLOC: (loc: LOCModel2) => dispatch(addLOC(loc)),
  updateLOC: (loc: LOCModel2) => dispatch(updateLOC(loc)),
  removeLOC: (address) => dispatch(removeLOC(address)),
  submitForm: () => dispatch(submit(LOC_FORM_NAME))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCModal extends Component {
  handleSubmitClick = () => {
    this.props.submitForm()
  }

  handleSubmitSuccess = (locModel: LOCModel2) => {
    this.handleClose()
    if (this.props.loc.isNew()) {
      this.props.addLOC(locModel)
    } else {
      this.props.updateLOC(locModel)
    }
  }

  handleDeleteClick = () => {
    // TODO @dkchv: !!!!
    console.log('--LOCModal#handleDeleteClick', 5)
    // let address = this.refs.LOCForm.getWrappedInstance().values.get('address')
    // this.props.removeLOC(address)
  }

  handleClose = () => {
    this.props.hideModal()
  }

  render () {
    const {open, isPristine, loc} = this.props
    const isNew = loc.isNew()

    const actions = [
      !isNew ? <FlatButton
        label={<Translate value='locs.delete' />}
        style={{float: 'left'}}
        onTouchTap={this.handleDeleteClick}
      /> : '',
      <FlatButton
        label={<Translate value='terms.cancel' />}
        primary
        onTouchTap={this.handleClose}
      />,
      <RaisedButton
        label={<Translate value={isNew ? 'locs.create' : 'locs.save'} />}
        primary
        onTouchTap={this.handleSubmitClick}
        disabled={isPristine}
      />
    ]

    return (
      <ModalBase
        title={isNew ? 'locs.new' : 'locs.edit'}
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <div style={globalStyles.greyText}>
          <Translate value='forms.mustBeCoSigned' />
        </div>

        <LOCForm
          initialValues={loc.toFormJS()}
          onSubmitSuccess={this.handleSubmitSuccess}
        />

      </ModalBase>
    )
  }
}

export default LOCModal
