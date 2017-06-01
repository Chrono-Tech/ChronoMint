// import * as actions from '../../../src/redux/locs/locForm/actions'
import { showIssueLHModal, showLOCModal, LOC_TYPE, ISSUE_LH_TYPE, MODAL_SHOW } from '../../../src/redux/ui/modal'
import { store } from '../../init'

describe('LOCs Modal Actions', () => {
  it('should show LOCs Modal', () => {
    store.dispatch(showLOCModal({locExists: true}))

    expect(store.getActions()).toContainEqual({
      payload: {modalProps: {locExists: true}, modalType: LOC_TYPE},
      type: MODAL_SHOW
    })
  })

  it('should show Issue LH Modal', () => {
    store.dispatch(showIssueLHModal())

    expect(store.getActions()).toContainEqual({
      payload: {modalProps: undefined, modalType: ISSUE_LH_TYPE},
      type: MODAL_SHOW
    })
  })
})
