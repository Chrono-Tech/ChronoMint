import {grey500} from 'material-ui/styles/colors'

const styles = {
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: 'auto',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left: 0,
    right: 0,
    margin: 'auto'
  },
  loginWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#262449'
  },
  logo: {
    marginBottom: '40px',
    textAlign: 'center',
    fontSize: '40px',
    display: 'block',
    fontFamily: '"proxima_nova",Arial,Verdana,sans-serif'
  },
  logo__chrono: {
    color: '#4b8fb9',
    letterSpacing: '-0.04em',
    display: 'inline-block',
    verticalAlign: 'middle',
    fontWeight: '400'
  },
  logo__bank: {
    color: '#d9a162'
  },
  logo__img: {
    width: '110px',
    height: '75px',
    backgroundImage: 'url(' + require('../../../assets/chrono-bank-logo.svg') + ')',
    margin: '0 auto 12px'
  },
  logo__beta: {
    color: 'white',
    fontSize: '16px',
    marginLeft: '5px'
  },
  paper: {
    padding: 20,
    overflow: 'hidden'
  },
  buttonsDiv: {
    textAlign: 'center',
    marginTop: 10
  },
  flatButton: {
    color: grey500,
    width: '50%'
  },
  loginBtn: {
    marginTop: 10
  },
  backBtn: {
    marginTop: 10
  },
  or: {
    marginTop: '10px',
    textAlign: 'center'
  }
}

export default styles
