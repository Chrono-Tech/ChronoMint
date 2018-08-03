/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export const standardFuncs = {
  GET_LOC_COUNT: 'getLOCCount',
  GET_LOC_BY_NAME: 'getLOCByName',
  GET_LOC_BY_ID: 'getLOCById',
  ADD_LOC: 'addLOC',
  SET_LOC: 'setLOC',
  SET_STATUS: 'setStatus',
}

export const multisigFuncs = {
  SEND_ASSET: 'sendAsset',
  REISSUE_ASSET: 'reissueAsset',
  REVOKE_ASSET: 'revokeAsset',
  REMOVE_LOC: 'removeLOC',
  SET_STATUS: 'setStatus',
}

export const events = {
  NEW_LOC: 'NewLOC',
  REMOVE_LOC: 'RemLOC',
  UPDATE_LOC: 'UpdateLOC',
  UPDATE_LOC_STATUS: 'UpdLOCStatus',
  REISSUE: 'Reissue',
  REVOKE: 'Revoke',
}
