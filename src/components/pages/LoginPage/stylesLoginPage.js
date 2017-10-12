import colors from '../../../styles/themes/variables'

const commonInputStyles = {
  style: {
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 16px',
    color: colors.colorWhite,
    marginTop: 14,
    cursor: 'pointer'
  },
  underlineStyle: {
    bottom: 0,
    left: 0,
    right: 0,
    borderBottom: '2px solid rgba(255, 255, 255, 0.6)'
  },
  floatingLabelStyle: {
    color: colors.colorWhite,
    opacity: '0.6'
  },
  errorStyle: {
    marginTop: 15
  }
}

const styles = {
  colors,
  selectField: {
    ...commonInputStyles,
    iconStyle: {
      paddingRight: 0,
      right: -10
    },
    labelStyle: {
      color: colors.colorWhite
    },
    selectedMenuItemStyle: {
      color: colors.selected
    },
    menuStyle: {
      marginTop: 0,
      display: 'block'
    },
    floatingLabelStyle: {
      lineHeight: 0,
      color: colors.colorWhite,
      opacity: 0.6
    },
    menuItemStyle:{
      wordWrap: 'break-word',
      whiteSpace: 'normal'
    }
  },
  textField: {
    ...commonInputStyles,
    textareaStyle: {
      color: colors.colorWhite
    }
  },
  flatButton: {
    style: {
      color: 'white',
      lineHeight: '16px',
      overflow: 'visible'
    },
    labelStyle: {
      fontWeight: 300,
      paddingRight: 0,
      paddingLeft: 0
    }
  },
  icon: {
    color: colors.colorPrimary1,
    marginLeft: 0,
    fontSize: 16
  },
  secondaryButton: {
    backgroundColor: colors.colorWhite,
    color: colors.colorAccent2,
    fontWeight: 300
  },
  primaryButton: {
    backgroundColor: colors.colorAccent2,
    color: colors.colorWhite,
    fontWeight: 300
  },
  primaryButtonLabel: {
    whiteSpace: 'nowrap',
    lineHeight: 1.2
  },
  checkbox: {
    labelStyle: {
      fontSize: 14,
      fontWeight: 300,
      color: colors.colorPrimary0
    },
    iconStyle: {
      color: colors.colorAccent2
    }
  }
}

export default styles
