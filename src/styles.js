import { typography } from 'material-ui/styles'
import { grey600, grey400 } from 'material-ui/styles/colors'

const status = {
  block: {
    textAlign: 'right',
    width: 130,
    float: 'right'
  },
  orange: {
    color: 'orange'
  },
  red: {
    color: 'red'
  },
  green: {
    color: 'green'
  },
  grey: {
    color: 'grey'
  }
}

const colors = {
  LHT: '#17579c',
  ETH: '#161240',
  TIME: '#4a8fb9'
}

const item = {
  status,
  paper: {
    padding: 38,
    paddingBottom: 8,
    marginTop: 24
  },
  title: {
    fontSize: 24
  },
  greyText: {
    color: 'grey',
    fontSize: 12,
    lineHeight: '18px',
    marginTop: 4
  },
  lightGrey: {
    color: grey400,
    fontSize: 15,
    padding: '10px 0px'
  }
}

const styles = {
  item,
  colors,
  navigation: {
    fontSize: 15,
    fontWeight: typography.fontWeightLight,
    color: grey600,
    paddingBottom: 15,
    display: 'block'
  },
  title: {
    fontSize: 24,
    fontWeight: typography.fontWeightLight,
    color: '#17579c',
    marginBottom: 20
  },
  paper: {
    padding: 30
  },
  clear: {
    clear: 'both'
  },
  title2: {
    fontSize: 48,
    fontWeight: typography.fontWeightLight,
    // color: '#17579c',
    marginBottom: 20
  },
  title2Wrapper: {
    marginBottom: 20
  },
  flatButton: {
    lineHeight: 'normal',
    height: 17,
    marginTop: 6
  },
  flatButtonLabel: {
    fontSize: 12,
    fontWeight: 600,
    padding: 0
  },
  raisedButton: {
    height: 30,
    lineHeight: '30px',
    fontSize: 15
  },
  raisedButtonLabel: {
    fontSize: 12,
    fontWeight: 600
  },
  grayButtonLabel: {
    fontSize: 11,
    color: 'grey',
    padding: 4
  },
  description: {
    fontWeight: 600,
    lineHeight: 'normal'
  },
  greyText: {
    color: 'grey',
    fontSize: 14,
    lineHeight: '18px'
  },
  paperSpace: {
    marginTop: '20px'
  }
}

export default styles
