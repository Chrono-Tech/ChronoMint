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
        color: '#000',
        textAlign: 'left',
        marginTop: 16,
        paddingTop: 0,
        paddingBottom: 0,
        font: '16px proxima nova, sans-serif',
        height: 'auto !important',
      },
      inputMultiline: {
        height: 62,
        marginTop: 0,
        '&:before': {
          display: 'none',
        },
      },
      underline: {
        '&:not($disabled):after': {
          borderBottom: `1px solid #A3A3CC`,
          transform: 'none',
        },
        '&:not($disabled):$focused:after': {
          borderBottomColor: `#E2A864`,
        },
        '&:hover:not($disabled):not($focused):not($error):after': {
          borderBottomColor: `#E2A864`,
        },
      },
    },
    MuiFormLabel: {
      root: {
        '&$focused': {
          color: '#A3A3CC',
        },
        '&$shrink': {
          top: 0,
        },
        color: '#A3A3CC',
        margin: 'auto',
        right: 0,
        left: 0,
        top: '7px !important',
        textAlign: 'center',
        transformOrigin: 'top center !important',
      },
      error: {
        color: '#A3A3CC !important',
      },
    },
    MuiFormHelperText: {
      root: {
        textAlign: 'center',
      },

    },
  },
})
