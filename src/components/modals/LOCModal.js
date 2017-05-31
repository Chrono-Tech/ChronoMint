import { connect } from 'react-redux'
import React, { Component } from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import LOCForm, { LOC_FORM_NAME } from '../forms/LOCForm/LOCForm'
import { addLOC, removeLOC } from '../../redux/locs/locForm/actions'
import globalStyles from '../../styles'
import { Translate } from 'react-redux-i18n'
import ModalBase from './ModalBase/ModalBase'
import { isPristine, submit } from 'redux-form/immutable'

const mapStateToProps = (state) => ({
  isPristine: isPristine(LOC_FORM_NAME)(state)
})

const mapDispatchToProps = (dispatch) => ({
  addLOC: (loc) => dispatch(addLOC(loc)),
  removeLOC: (address) => dispatch(removeLOC(address)),
  submitForm: () => dispatch(submit(LOC_FORM_NAME))
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCModal extends Component {
  handleSubmitClick = () => {
    this.props.submitForm()
  }

  handleSubmitSuccess = (locModel) => {
    this.handleClose()
    this.props.addLOC(locModel)
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
    const {open, locExists, isPristine} = this.props

    const actions = [
      locExists ? <FlatButton
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
        label={<Translate value={locExists ? 'locs.save' : 'locs.create'} />}
        primary
        onTouchTap={this.handleSubmitClick}
        disabled={isPristine}
      />
    ]

    return (
      <ModalBase
        title={locExists ? 'locs.edit' : 'locs.new'}
        onClose={this.handleClose}
        actions={actions}
        open={open}
      >
        <div style={globalStyles.greyText}>
          <Translate value='forms.mustBeCoSigned' />
        </div>

        <LOCForm onSubmitSuccess={this.handleSubmitSuccess} />

      </ModalBase>
    )
  }
}

export default LOCModal
