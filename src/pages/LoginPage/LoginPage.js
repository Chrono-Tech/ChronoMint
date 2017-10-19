import React from 'react'
import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import { styles } from 'Login/settings'
import { MuiThemeProvider } from 'material-ui'
import './LoginPage.scss'
import LoginForm from 'Login'

const LoginPage = () => {
  return (
    <MuiThemeProvider muiTheme={styles.inverted}>
      <div>
        <LoginForm />
        <ul styleName='actions'>
          <li>
            <LocaleDropDown />
          </li>
        </ul>
      </div>
    </MuiThemeProvider>
  )
}

export default LoginPage
