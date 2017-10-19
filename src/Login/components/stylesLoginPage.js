import { styles as stylesConfig } from 'Login/settings'


const commonInputStyles = {
  style: {
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 16px',
    color: stylesConfig.colors.colorWhite,
    marginTop: 14,
    cursor: 'pointer',
  },
  underlineStyle: {
    bottom: 0,
    left: 0,
    right: 0,
    borderBottom: '2px solid rgba(255, 255, 255, 0.6)',
  },
  floatingLabelStyle: {
    color: stylesConfig.colors.colorWhite,
    opacity: '0.6',
  },
  errorStyle: {
    marginTop: 15,
  },
}

const styles = {
  theme: stylesConfig.theme,
  colors: stylesConfig.colors,
  selectField: {
    ...commonInputStyles,
    iconStyle: {
      paddingRight: 0,
      right: -10,
    },
    labelStyle: {
      color: stylesConfig.colors.colorWhite,
    },
    selectedMenuItemStyle: {
      color: stylesConfig.colors.selected,
    },
    menuStyle: {
      marginTop: 0,
      display: 'block',
    },
    floatingLabelStyle: {
      lineHeight: 0,
      color: stylesConfig.colors.colorWhite,
      opacity: 0.6,
    },
    menuItemStyle: {
      wordWrap: 'break-word',
      whiteSpace: 'normal',
    },
  },
  textField: {
    ...commonInputStyles,
    textareaStyle: {
      color: stylesConfig.colors.colorWhite,
    },
  },
  flatButton: {
    style: {
      color: 'white',
      lineHeight: '16px',
      overflow: 'visible',
    },
    labelStyle: {
      fontWeight: 300,
      paddingRight: 0,
      paddingLeft: 0,
    },
  },
  icon: {
    color: stylesConfig.colors.colorPrimary1,
    marginLeft: 0,
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: stylesConfig.colors.colorWhite,
    color: stylesConfig.colors.colorAccent2,
    fontWeight: 300,
  },
  primaryButton: {
    backgroundColor: stylesConfig.colors.colorAccent2,
    color: stylesConfig.colors.colorWhite,
    fontWeight: 300,
  },
  primaryButtonLabel: {
    whiteSpace: 'nowrap',
    lineHeight: 1.2,
  },
  checkbox: {
    labelStyle: {
      fontSize: 14,
      fontWeight: 300,
      color: stylesConfig.colors.colorPrimary0,
    },
    iconStyle: {
      color: stylesConfig.colors.colorAccent2,
    },
  },
}

export default styles
