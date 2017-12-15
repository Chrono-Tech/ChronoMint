import AllowanceModel from './AllowanceModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class AllowanceCollection extends abstractFetchingCollection({
  emptyModel: new AllowanceModel(),
}) {

}
