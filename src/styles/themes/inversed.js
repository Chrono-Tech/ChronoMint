/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createMuiTheme } from '@material-ui/core/styles'
import variables from './variables'

export default createMuiTheme({
  raisedButton: {
    primaryColor: variables.colorAccent2,
    primaryTextColor: variables.colorWhite,
    secondaryColor: variables.colorWhite,
    secondaryTextColor: variables.colorAccent2,
    disabledColor: variables.disabledColor1,
    disabledTextColor: variables.colorWhite,
  },
})
