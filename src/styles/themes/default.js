/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import { createMuiTheme } from '@material-ui/core/styles'
import variables from './variables'

export default createMuiTheme({
  palette: {
    accent1Color: variables.colorAccent1,
    textColor: variables.colorPrimary0,
    primary1Color: variables.colorPrimary1,
    borderColor: variables.colorPrimary0Alter2,
    disabledColor: variables.colorPrimary0Alter1,
  },
  overrides: {
    MuiInput: {
      root: {
        height: 62,
        marginTop: 0,
      },
      formControl: {
        marginTop: '0 !important',
      },
      input: {
        color: '#fff',
        textAlign: 'left',
        marginTop: 0,
        paddingTop: 18,
        paddingBottom: 0,
        font: '16px proxima nova, sans-serif',
        height: 'auto !important',
      },
      inputMultiline: {
        height: 62,
        marginTop: 0,
        padding: 6,
        textAlign: 'left',
        '&:before': {
          display: 'none',
        },
      },
      underline: {
        '&:before': {
          display: 'none',
        },
        '&:after': {
          borderBottom: '1px solid #A3A3CC',
          transform: 'none',
        },
        '&:not($disabled):$focused:after': {
          borderBottom: '1px solid #E2A864',
        },
        '&:hover:not($disabled):not($focused):not($error):after': {
          borderBottomColor: `#E2A864`,
        },
        '&$focused:after': {
          borderBottom: '1px solid #E2A864',
        },
      },
    },
    MuiInputLabel: {
      root: {
        '&$shrink': {
          color: '#A3A3CC',
        },
        color: '#A3A3CC',
        margin: 'auto',
        right: 0,
        left: 0,
        top: 7,
        textAlign: 'left',
        transformOrigin: 'top left',
      },
      shrink: {
        top: 8,
        transformOrigin: 'top left',
      },
      formControl: {
        top: 7,
      },
      error: {
        color: '#A3A3CC',
      },
    },
    MuiFormHelperText: {
      root: {
        textAlign: 'center',
      },

    },
  },
})
