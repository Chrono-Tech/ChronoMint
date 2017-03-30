import {showLOCModal, showIssueLHModal, showUploadedFileModal} from '../ui/modal'
import {storeLOCAction} from './loc'
import IPFSDAO from '../../dao/IPFSDAO'
import LOCModel from '../../models/LOCModel'

export const handleShowLOCModal = (loc: LOCModel) => (dispatch) => {
  dispatch(storeLOCAction(loc))
  dispatch(showLOCModal({locExists: !!loc}))
}

export const handleShowIssueLHModal = (loc: LOCModel) => (dispatch) => {
  dispatch(storeLOCAction(loc))
  dispatch(showIssueLHModal())
}

export const handleViewContract = (loc: LOCModel) => (dispatch) => {
  IPFSDAO.getNode().files.cat(loc.get('publishedHash'), (e, r) => {
    let data = ''
    r.on('data', (d) => {
      data += d
    })
    r.on('end', () => {
      dispatch(showUploadedFileModal({data}))
    })
  })
}
