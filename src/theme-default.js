import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {blue600, grey900} from 'material-ui/styles/colors';

const themeDefault = getMuiTheme({
  palette: {
        accent1Color: '#161240',
        textColor: '#00BCD4',
        primary1Color: '#311B92'
  },
  appBar: {
    height: 57,
    color: '#161240'
  },
  drawer: {
    width: 230,
    color: '#161240'
  },
  raisedButton: {
    primaryColor: blue600,
  }
});

export default themeDefault;
