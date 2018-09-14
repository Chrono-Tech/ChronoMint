import { multiClientMiddleware } from 'redux-axios-middleware'
import clients from './clients'

const axiosMiddleware = multiClientMiddleware(
  clients,
  {
    returnRejectedPromiseOnError: true, // We need it to process any HTTP errors in our source code
  }
)

export default axiosMiddleware
