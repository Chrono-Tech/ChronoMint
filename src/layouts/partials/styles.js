/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import variables from 'styles/themes/variables'

export default {
  header: {
    route: {
      style: {
        color: variables.colorPrimary0,
        fontWeight: 'bold',
        cursor: 'pointer',
      },
      labelStyle: {
        textTransform: 'none',
        color: variables.colorPrimary0,
      },
      labelStyleDisabled: {
        textTransform: 'none',
        color: variables.disabledColor2,
      },
      iconStyleDisabled: {
        color: variables.disabledColor2,
      },
    },
    progress: {
      color: '#FF9800',
    },
    popover: {
      style: {
        overflowX: 'visible',
        overflowY: 'auto',
        maxWidth: '90%',
      },
    },
  },
  brand: {
    localeDropDown: {
      labelStyle: {
        verticalAlign: 'middle',
        margin: '-5px 0px 0px 0px',
        color: variables.colorWhite,
        fontSize: '16px',
        paddingLeft: '20px',
        paddingRight: '35px',
      },
      iconStyle: {
        right: 0,
      },
    },
    toggle: {
      iconStyle: {
        color: variables.colorWhite,
      },
    },
  },
  drawer: {
    item: {
      style: {
        color: variables.colorPrimary1,
      },
      styleDisabled: {
        color: variables.disabledColor2,
      },
      innerDivStyle: {
        paddingLeft: 60,
        paddingRight: 24,
      },
      iconStyle: {
        color: variables.colorPrimary1,
        marginLeft: 13,
        marginRight: 13,
      },
      iconStyleDisabled: {
        color: variables.disabledColor2,
        marginLeft: 13,
        marginRight: 13,
      },
    },
    itemActive: {
      style: {
        backgroundColor: variables.colorPrimary0,
        color: variables.colorWhite,
      },
      iconStyle: {
        color: variables.colorWhite,
      },
    },
  },
  content: {
    header: {
      link: {
        color: variables.colorWhite,
      },
    },
  },
  footer: {
    form: {
      inputStyle: {
        color: 'rgba(255, 255, 255, 1)',
      },
      hintStyle: {
        color: 'rgba(255, 255, 255, 0.6)',
        // opacity: 0.6
      },
    },
  },
  buttonWithIconStyles: {
    style: {
      height: 'auto',
      padding: 10,
      overflow: 'visible',
      lineHeight: 1.2,
      textAlign: 'left',
    },
    labelStyle: {
      padding: 0,
      display: 'block',
      color: variables.colorPrimary1,
    },
  },
  buttonRaisedMultyLine: {
    style: {
      height: 'auto',
      overflow: 'visible',
      textAlign: 'left',
    },
    buttonStyle: {
      lineHeight: 'normal',
    },
    labelStyle: {
      display: 'block',
    },
  },
  textField: {
    hintStyle: {
      color: variables.colorPrimary1,
    },
  },
  toggle: {
    labelStyle: {
      fontSize: 24,
      fontWeight: variables.fontWeightBold,
      color: variables.colorBlack,
    },
  },
}
