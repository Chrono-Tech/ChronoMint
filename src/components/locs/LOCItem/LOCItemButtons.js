import FlatButton from 'material-ui/FlatButton'
import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Translate } from 'react-redux-i18n'
import { connect } from 'react-redux'
import type LOCModel from 'models/LOCModel'
import { modalsOpen } from 'redux/modals/actions'
import LOCDialog from 'components/dialogs/LOC/LOCDialog/LOCDialog'
import LOCIssueDialog from 'components/dialogs/LOC/LOCIssueDialog/LOCIssueDialog'
import LOCRedeemDialog from 'components/dialogs/LOC/LOCRedeemDialog/LOCRedeemDialog'
import LOCStatusDialog from 'components/dialogs/LOC/LOCStatusDialog/LOCStatusDialog'
import IPFS from '../../../utils/IPFS'

const mapDispatchToProps = (dispatch) => ({
  showLOCDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCDialog,
    props: { loc },
  })),
  showLOCStatusDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCStatusDialog,
    props: { loc },
  })),
  showLOCIssueDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCIssueDialog,
    props: { loc },
  })),
  showLOCRedeemDialog: (loc: LOCModel) => dispatch(modalsOpen({
    component: LOCRedeemDialog,
    props: { loc },
  })),
  showUploadedFileModal: (loc: LOCModel) => {
    // eslint-disable-next-line
    console.warn('showUploadedFileModal is not implemented. Args:', loc)
    // TODO @ipavlenko: Dead code, showUploadedFileModal doesn't exist
    // dispatch(showUploadedFileModal(loc))
  },
})

@connect(null, mapDispatchToProps)
class Buttons extends PureComponent {
  static propTypes = {
    loc: PropTypes.object,
    showUploadedFileModal: PropTypes.func,
    showLOCDialog: PropTypes.func,
    showLOCIssueDialog: PropTypes.func,
    showLOCRedeemDialog: PropTypes.func,
    showLOCStatusDialog: PropTypes.func,
  }

  handleViewContract = () => {
    const { loc } = this.props
    IPFS.getAPI().files.cat(loc.publishedHash(), (e, r) => {
      let data = ''
      r.on('data', (d) => {
        data += d
      })
      r.on('end', () => {
        this.props.showUploadedFileModal({ data })
      })
    })
  }

  render () {
    const { loc } = this.props
    const isActive = loc.isActive()
    const isNotExpired = loc.isNotExpired()
    const isPending = loc.isPending()
    const currency = loc.currency()

    return (
      // TODO @dkchv: view contract disable until MINT-277 (fileSelect & ipfs)
      <div>
        <FlatButton
          label={<Translate value='loc.viewContract' />}
          disabled
          onTouchTap={this.handleViewContract}
        />
        {isNotExpired && (
          <FlatButton
            label={<Translate value='locs.issueS' asset={currency} />}
            disabled={!isActive || isPending}
            onTouchTap={() => this.props.showLOCIssueDialog(loc)}
          />
        )}
        {isNotExpired && (
          <FlatButton
            label={<Translate value='locs.redeemS' asset={currency} />}
            disabled={!isActive || isPending || loc.issued() === 0}
            onTouchTap={() => this.props.showLOCRedeemDialog(loc)}
          />
        )}
        {isNotExpired && (
          <FlatButton
            label={<Translate value='terms.status' />}
            disabled={isPending}
            onTouchTap={() => this.props.showLOCStatusDialog(loc)}
          />
        )}
        <FlatButton
          label={<Translate value='locs.editInfo' />}
          disabled={isPending || isActive}
          onTouchTap={() => this.props.showLOCDialog(loc)}
        />
      </div>
    )
  }
}

export default Buttons
