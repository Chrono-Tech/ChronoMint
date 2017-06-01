import React from 'react'

import { RaisedButton, TextField } from 'material-ui'

import BrandLogo from './BrandLogo'

import styles from './styles'
import './FooterPartial.scss'

export default class FooterPartial extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div styleName="root">
        <div styleName="row">
          <div styleName="column">
            <div styleName="papers">
              <h2><BrandLogo /></h2>
              <ul>
                <li><a href="#">Download</a> Business outline</li>
                <li><a href="#">Download</a> Development plan</li>
                <li><a href="#">Download</a> White paper</li>
              </ul>
            </div>
            <div styleName="copyright">
              <p>Copyright © 2016-2017 Edway Group Pty. Ltd. All Rights Reserved.</p>
            </div>
          </div>
          <div styleName="column">
            <div styleName="menu">
              <h3>Menu</h3>
              <ul>
                <li><a href="#">About</a></li>
                <li><a href="#">Labour&mdash;Hours</a></li>
                <li><a href="#">LaborX</a></li>
                <li><a href="#">Team</a></li>
                <li><a href="#">Q&A</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
          </div>
          <div styleName="column">
            <div styleName="contacts">
              <h3>Contact us</h3>
              <div styleName="items">
                <div styleName="item">
                  <div styleName="title">Technical support:</div>
                  <div styleName="link"><a href="mailto:support@chronobank.io">support@chronobank.io</a></div>
                </div>
                <div styleName="item">
                  <div styleName="title">General inquiries:</div>
                  <div styleName="link"><a href="mailto:info@chronobank.io">info@chronobank.io</a></div>
                </div>
              </div>
            </div>
            <div styleName="social">
              <h3>Social Network</h3>
              <div styleName="items">
                <a styleName="item">
                  <i className="fa fa-facebook"></i>
                </a>
                <a styleName="item">
                  <i className="fa fa-twitter"></i>
                </a>
                <a styleName="item">
                  <i className="fa fa-instagram"></i>
                </a>
                <a styleName="item">
                  <i className="fa fa-reddit-alien"></i>
                </a>
                <a styleName="item">
                  <i className="fa fa-slack"></i>
                </a>
                <a styleName="item">
                  <i className="fa fa-telegram"></i>
                </a>
                <a styleName="item">
                  <i className="fa fa-github"></i>
                </a>
              </div>
            </div>
          </div>
          <div styleName="column">
            <div styleName="form">
              <h3>Newsletter</h3>
              <div styleName="fields">
                <TextField hintText="Enter email for news"
                  inputStyle={styles.footer.form.inputStyle}
                  hintStyle={styles.footer.form.hintStyle}
                />
              </div>
              <div styleName="actions">
                <RaisedButton label="Subscribe" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
