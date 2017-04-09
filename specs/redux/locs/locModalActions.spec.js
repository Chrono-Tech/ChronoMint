import * as actions from '../../../src/redux/locs/locModalActions'
import {store} from '../../init'
import LOCModel from '../../../src/models/LOCModel'

describe('LOCs Modal Actions', () => {
  it('should show LOCs Modal', () => {
    const locModel = new LOCModel({address: 0x10})
    store.dispatch(actions.handleShowLOCModal(locModel))

    expect(store.getActions()[0]).toEqual({payload: locModel, type: 'locForm/STORE'})

    expect(store.getActions()[1]).toEqual({
      payload: {modalProps: {locExists: true}, modalType: 'modals/LOC_TYPE'},
      type: 'modal/SHOW'
    })
  })

  it('should show Issue LH Modal', () => {
    const locModel = new LOCModel({address: 0x10})
    store.dispatch(actions.handleShowIssueLHModal(locModel))

    expect(store.getActions()[0]).toEqual({payload: locModel, type: 'locForm/STORE'})

    expect(store.getActions()[1]).toEqual({
      payload: {modalProps: undefined, modalType: 'modals/ISSUE_LH_TYPE'},
      type: 'modal/SHOW'
    })
  })
})
