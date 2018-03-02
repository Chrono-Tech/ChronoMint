import variables from 'styles/themes/variables'

export default {
  widgets: {
    sendTokens: {
      currency: {
        style: {
          width: '100%',
        },
        labelStyle: {
          width: '100%',
          color: variables.colorWhite,
        },
        menuItemStyle: {
          color: variables.colorPrimary0,
        },
      },
    },
  },
  buttons: {
    blockRaisedButton: {
      buttonStyle: {
        backgroundColor: variables.blockColor,
      },
      labelStyle: {
        color: variables.colorWhite,
        fontWeight: variables.fontWeightBold,
      },
    },
  },
}
