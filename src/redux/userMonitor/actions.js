import UserMonitorService from 'redux/userMonitor/monitorService'

export const changeActiveStatus = (status) => (dispatch) => {
  return dispatch(status)
}


export const watchInitUserMonitor = () => (dispatch) => {

  UserMonitorService
    .on('active', (status) => {
      // eslint-disable-next-line
      console.log(status, status.payload)
      // dispatch(changeActiveStatus(status))
    })

  UserMonitorService
    .start()

}
