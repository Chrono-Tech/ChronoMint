import { getMuiTheme } from 'material-ui/styles'

import variables from './variables'

export default getMuiTheme({
  palette: {
    accent1Color: variables.colorAccent1,
    textColor: variables.colorPrimary0,
    primary1Color: variables.colorPrimary1,
    borderColor: variables.colorPrimary0Alter2,
    disabledColor: variables.colorPrimary0Alter1,
  },
})
