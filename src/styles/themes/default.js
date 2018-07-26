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
        color: variables.colorPrimaryBlack,
        textAlign: 'left',
        marginTop: 0,
        paddingTop: 18,
        paddingBottom: 0,
        font: '16px proxima nova, sans-serif',
      },
      inputType: {
        height: 'auto',
      },
      inputTypeSearch: {
        height: 'auto',
      },
      inputMarginDense: {
        height: 'auto',
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
          borderBottom: `1px solid`,
          borderBottomColor: variables.additionalDataColor,
          transform: 'none',
        },
        '&:not($disabled):$focused:after': {
          borderBottomColor: variables.colorOrange,
        },
        '&:hover:not($disabled):not($focused):not($error):after': {
          borderBottomColor: variables.colorOrange,
        },
        '&$focused:after': {
          borderBottomColor: variables.colorOrange,
        },
      },
    },
    MuiInputLabel: {
      root: {
        '&$shrink': {
          color: variables.additionalDataColor,
        },
        color: variables.additionalDataColor,
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
    },
    MuiFormHelperText: {
      root: {
        textAlign: 'center',
      },

    },
  },
})
