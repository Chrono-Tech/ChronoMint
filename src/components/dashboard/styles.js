/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import variables from 'styles/themes/variables'

export default {
  style: {
    width: '185px',
    marginLeft: '30px'
  },
  labelStyle: {
    width: '100%',
    fontSize: '25px',
    color: variables.colorWhite,
  },
  menuItemStyle: {
    color: variables.colorPrimary0,
  },
  whiteSelectorStyle: {
    iconStyle: {
      paddingRight: 0,
      right: -10,
      fill: variables.colorWhite,
    },
    labelStyle: {
      color: variables.colorWhite,
      fontWeight: 700,
    },
    selectedMenuItemStyle: {
      color: variables.colorBlack,
      fontWeight: 700,
    },
    menuItemStyle: {
      color: variables.colorBlack,
    },
    underlineStyle: {
      borderColor: variables.colorWhite,
    },
  },
}
