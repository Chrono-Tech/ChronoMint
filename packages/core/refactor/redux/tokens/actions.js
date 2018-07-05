import uuid from 'uuid/v1'
import { ERC20_INTERFACE } from 'packages/core/refactor/daos/index'
import { TokenModel, TokenDAOModel } from 'src/models'
import { daoByType } from 'src/store/daos/selectors'

export const TOKENS_REGISTER = 'tokens/register'
export const TOKENS_ETH = 'tokens/eth'

export const initTokens = ({ web3 }) => async (dispatch, getState) => {

  const erc20LibrayDAO = daoByType('ERC20Library')(getState())

  const context = {
    getAbi: (/*address*/) => ERC20_INTERFACE.abi,
  }

  const ethTokenDAOModel = TokenDAOModel.fromTokenModel(
    new TokenModel({
      key: uuid(),
      address: null,
    }),
    context,
  )
  ethTokenDAOModel.dao.connect(web3)
  dispatch({
    type: TOKENS_ETH,
    model: ethTokenDAOModel,
  })

  const contracts = await erc20LibrayDAO.getContracts()

  const models = await Promise.all(
    contracts.map(
      async address => {
        const token = new TokenModel({
          key: uuid(),
          address,
        })
        const tokenDAOModel = TokenDAOModel.fromTokenModel(token, context)
        tokenDAOModel.dao.connect(web3)
        return tokenDAOModel
      }
    )
  )

  for (const model of models) {
    dispatch({
      type: TOKENS_REGISTER,
      model,
    })
  }
}
