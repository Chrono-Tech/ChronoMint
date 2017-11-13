import UserMonitorService from 'user/monitorService'
import { modalsOpen } from 'redux/modals/actions'
import UserActiveDialog from 'components/dialogs/UserActiveDialog/UserActiveDialog'

export const removeWatchersUserMonitor = () => () => {
  UserMonitorService
    .removeAllListeners('active')

  UserMonitorService
    .stop()
}

export const watchInitUserMonitor = () => (dispatch) => {
  UserMonitorService
    .on('active', () => {
      dispatch(modalsOpen({ component: UserActiveDialog }))
    })

  UserMonitorService
    .start()
}
