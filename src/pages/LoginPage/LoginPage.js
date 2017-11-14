import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import LoginForm from 'Login/page/LoginForm'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { styles } from 'Login/settings'

import './LoginPage.scss'

class LoginPage extends PureComponent {
  render () {
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
}

export default LoginPage
