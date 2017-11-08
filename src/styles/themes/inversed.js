import { getMuiTheme } from 'material-ui/styles'
import variables from './variables'

export default getMuiTheme({
  raisedButton: {
    primaryColor: variables.colorAccent2,
    primaryTextColor: variables.colorWhite,
    secondaryColor: variables.colorWhite,
    secondaryTextColor: variables.colorAccent2,
    disabledColor: variables.disabledColor1,
    disabledTextColor: variables.colorWhite,
  },
})
