import { grey500 } from 'material-ui/styles/colors'
import colors from '../../../styles/themes/variables'

const commonInputStyles = {
  style: {
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 16px',
    color: colors.colorWhite,
    marginTop: 14
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
  buttonsDiv: {
    textAlign: 'center',
    marginTop: 10
  },
  flatButton: {
    color: grey500,
    width: '50%'
  },
  backBtn: {
    marginTop: 10
  },
  tip: {
    marginTop: '10px',
    textAlign: 'center',
    color: '#999'
  },
  selectField: {
    ...commonInputStyles,
    iconStyle: {
      paddingRight: 0,
      right: -10
    },
    selectedMenuItemStyle: {
      color: '#2962ff'
    },
    menuItemStyle: {
      color: 'black'
    }
  },
  textField: {
    ...commonInputStyles
  },
  flatButton2: {
    style: {
      color: 'white',
      lineHeight: '16px',
      overflow: 'visible'
    },
    labelStyle: {
      fontWeight: 300
    }
  },
  icon: {
    color: colors.colorPrimary1,
    marginLeft: 0,
    fontSize: 16
  },
  secondaryButton: {
    backgroundColor: colors.colorWhite,
    color: colors.colorAccent2
  },
  primaryButton: {
    backgroundColor: colors.colorAccent2,
    color: colors.colorWhite,
  },
  checkbox: {
    labelStyle: {
      fontSize: 14,
      color: colors.colorPrimary0
    },
    iconStyle: {
      color: colors.colorAccent2
    }
  }
}

export default styles
