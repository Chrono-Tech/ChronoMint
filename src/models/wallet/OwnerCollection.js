import OwnerModel from './OwnerModel'
import { abstractFetchingCollection } from '../AbstractFetchingCollection'

export default class OwnerCollection extends abstractFetchingCollection({
  emptyModel: new OwnerModel(),
}) {

}
