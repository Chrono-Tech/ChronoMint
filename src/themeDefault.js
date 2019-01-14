/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { blue600 } from '@material-ui/core/colors/blue'
import { createMuiTheme } from '@material-ui/core/styles'

const themeDefault = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    accent1Color: '#17579c',
    textColor: '#161240',
    primary1Color: '#161240',
  },
  appBar: {
    height: 57,
    color: '#161240',
  },
  drawer: {
    width: 230,
    color: '#161240',
  },
  raisedButton: {
    primaryColor: blue600,
  },
})

export default themeDefault
