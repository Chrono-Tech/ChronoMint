import contractsManagerDAO from 'dao/ContractsManagerDAO'

export const ASSETS_LIST = 'assets/LIST'

export const listAssets = () => async (dispatch) => {
  const dao = await contractsManagerDAO.getAssetsManagerDAO()
  dispatch({type: ASSETS_LIST, list: await dao.getList()})
}
