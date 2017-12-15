import BalanceModel from './BalanceModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class BalancesCollection extends abstractFetchingCollection({
  emptyModel: new BalanceModel(),
}) {

}
