import AssetModel from './AssetModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class AssetsCollection extends abstractFetchingCollection({
  emptyModel: AssetModel,
}) {

}
