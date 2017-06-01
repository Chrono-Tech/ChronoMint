import React from 'react'
import BrandLogo from './BrandLogo'

import './BrandPartial.scss'

export default class BrandPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="row">
          <h1 styleName="title"><BrandLogo styleName="brand" /></h1>
          <div styleName="subtitle">beta 10.0</div>
          <ul styleName="items">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Labour&mdash;Hours</a>
            </li>
            <li>
              <a href="#">LabourX</a>
            </li>
            <li>
              <a href="#">Team</a>
            </li>
            <li>
              <a href="#">Q&A</a>
            </li>
            <li>
              <a href="#">Blog</a>
            </li>
          </ul>
          <ul styleName="actions">
            <li><a href="#">Login</a></li>
            <li><a href="#">Eng</a></li>
          </ul>
        </div>
      </div>
    )
  }
}
