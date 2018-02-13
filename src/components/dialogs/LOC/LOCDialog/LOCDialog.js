import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { addLOC, updateLOC } from 'redux/locs/actions'
import { modalsClose } from 'redux/modals/actions'
import LOCModel from 'models/LOCModel'
import ModalDialogBase from 'components/dialogs/ModalDialogBase/ModalDialogBase'
import { getToken } from 'redux/locs/selectors'
import { LHT } from 'dao/LHTDAO'
import TokenModel from 'models/tokens/TokenModel'
import LOCForm from './LOCForm'

function mapStateToProps (state) {
  return {
    token: getToken(LHT)(state),
  }
}

const mapDispatchToProps = (dispatch) => ({
  addLOC: (loc: LOCModel) => dispatch(addLOC(loc)),
  updateLOC: (loc: LOCModel) => dispatch(updateLOC(loc)),
  handleCloseModal: () => dispatch(modalsClose()),
})

@connect(mapStateToProps, mapDispatchToProps)
class LOCDialog extends PureComponent {
  static propTypes = {
    addLOC: PropTypes.func,
    updateLOC: PropTypes.func,
    handleCloseModal: PropTypes.func,
    loc: PropTypes.instanceOf(LOCModel),
    token: PropTypes.instanceOf(TokenModel),
  }

  handleSubmitSuccess = (locModel: LOCModel) => {
    this.props.handleCloseModal()
    if (this.props.loc.isNew()) {
      this.props.addLOC(locModel)
    } else {
      this.props.updateLOC(locModel)
    }
  }

  render () {
    const { loc } = this.props
    const isNew = loc.isNew()

    return (
      <ModalDialogBase title={isNew ? 'locs.create' : 'locs.edit'}>
        <LOCForm
          loc={loc}
          initialValues={loc.toFormJS(this.props.token)}
          onSubmitSuccess={this.handleSubmitSuccess}
          onDelete={this.props.handleCloseModal}
        />
      </ModalDialogBase>
    )
  }
}

export default LOCDialog
