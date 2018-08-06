/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { Translate } from 'react-redux-i18n'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { addLOC, updateLOC } from '@chronobank/core/redux/locs/actions'
import { modalsClose } from 'redux/modals/actions'
import LOCModel from '@chronobank/core/models/LOCModel'
import { getToken } from '@chronobank/core/redux/locs/selectors'
import { LHT } from '@chronobank/core/dao/constants'
import TokenModel from '@chronobank/core/models/tokens/TokenModel'
import ModalDialog from 'components/dialogs/ModalDialog'
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
      <ModalDialog title={<Translate value={isNew ? 'locs.create' : 'locs.edit'} />}>
        <LOCForm
          loc={loc}
          initialValues={loc.toFormJS(this.props.token)}
          onSubmitSuccess={this.handleSubmitSuccess}
          onDelete={this.props.handleCloseModal}
        />
      </ModalDialog>
    )
  }
}

export default LOCDialog
