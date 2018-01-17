import LocaleDropDown from 'layouts/partials/LocaleDropDown/LocaleDropDown'
import LoginForm from '@chronobank/login-ui/components/LoginForm/LoginForm'
import { MuiThemeProvider } from 'material-ui'
import React, { PureComponent } from 'react'
import { styles } from '@chronobank/login-ui/settings'

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
