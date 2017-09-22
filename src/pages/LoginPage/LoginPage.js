import React from 'react'
import { styles } from 'Login/settings'
import { MuiThemeProvider } from 'material-ui'
import './LoginPage.scss'
import LoginForm from 'Login'
import LocaleDropDown from 'layouts/partials/LocaleDropDown'

const LoginPage = () => {
  return (
    <MuiThemeProvider muiTheme={styles.inverted}>
      <div>
        <LoginForm/>
        <ul styleName='actions'>
          <li>
            <LocaleDropDown/>
          </li>
        </ul>
      </div>
    </MuiThemeProvider>
  )
}

export default LoginPage
