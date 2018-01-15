import { abstractFetchingCollection } from '../AbstractFetchingCollection'
import AddressModel from './AddressModel'

export default class AddressesCollection extends abstractFetchingCollection({
  emptyModel: new AddressModel(),
}) {
}
