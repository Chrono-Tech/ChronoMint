import React from 'react'

import { MuiThemeProvider } from 'material-ui'
import { HeaderPartial, BrandPartial, InfoPartial, ContentPartial, FooterPartial, DrawerPartial } from './partials'

import theme from '@/styles/themes/default.js'

// import '@/styles/globals/index.global.css'

import './Markup.scss'

export default class Markup extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={theme}>
        <div styleName="root">
          <div styleName="top">
            <HeaderPartial />
          </div>
          <div styleName="middle">
            <div styleName="drawer">
              <DrawerPartial />
            </div>
            <div styleName="content">
              <BrandPartial />
              <InfoPartial />
              <ContentPartial />
              <FooterPartial />
            </div>
          </div>
          <div styleName="bottom"></div>
        </div>
      </MuiThemeProvider>
    )
  }
}
