import React from 'react'

import { RaisedButton, TextField } from 'material-ui'

import BrandLogo from './BrandLogo'

import styles from './styles'
import './FooterPartial.scss'

export default class FooterPartial extends React.Component {

  constructor (props) {
    super(props)
  }

  render () {
    return (
      <div styleName='root'>
        <div styleName='row'>
          <div styleName='column-left'>
            <div styleName='papers'>
              <h2><BrandLogo /></h2>
              <ul>
                <li><a href='https://chronobank.io/files/business_outline.pdf' target='_blank'>Download</a> Business
                  outline
                </li>
                <li><a href='https://chronobank.io/files/dev_plan.pdf' target='_blank'>Download</a> Development plan
                </li>
                <li><a href='https://chronobank.io/files/whitepaper.pdf' target='_blank'>Download</a> White paper</li>
              </ul>
            </div>
          </div>
          <div styleName='column-center'>
            <div styleName='menu'>
              <h3>Menu</h3>
              <ul>
                <li><a href='https://chronobank.io/#about' target='_blank'>About</a></li>
                <li><a href='https://chronobank.io/#labor-hours' target='_blank'>Labour&mdash;Hours</a></li>
                <li><a href='https://chronobank.io/#laborx' target='_blank'>LaborX</a></li>
                <li><a href='https://chronobank.io/#team' target='_blank'>Team</a></li>
                <li><a href='https://chronobank.io/faq' target='_blank'>Q&A</a></li>
                <li><a href='https://blog.chronobank.io/' target='_blank'>Blog</a></li>
              </ul>
            </div>
            <div styleName='contacts'>
              <h3>Contact us</h3>
              <div styleName='items'>
                <div styleName='item'>
                  <div styleName='title'>Technical support:</div>
                  <div styleName='link'><a href='mailto:support@chronobank.io'>support@chronobank.io</a></div>
                </div>
                <div styleName='item'>
                  <div styleName='title'>General inquiries:</div>
                  <div styleName='link'><a href='mailto:info@chronobank.io'>info@chronobank.io</a></div>
                </div>
              </div>
            </div>
            <div styleName='social'>
              <h3>Social Network</h3>
              <div styleName='items'>
                <a href='https://www.facebook.com/ChronoBank.io' target='_blank' styleName='item'>
                  <i className='fa fa-facebook' />
                </a>
                <a href='https://twitter.com/ChronobankNews' target='_blank' styleName='item'>
                  <i className='fa fa-twitter' />
                </a>
                <a href='https://www.instagram.com/chronobank.io/' target='_blank' styleName='item'>
                  <i className='fa fa-instagram' />
                </a>
                <a href='https://www.reddit.com/r/ChronoBank/' target='_blank' styleName='item'>
                  <i className='fa fa-reddit-alien' />
                </a>
                <a href='https://chronobank.herokuapp.com/' target='_blank' styleName='item'>
                  <i className='fa fa-slack' />
                </a>
                <a href='https://telegram.me/ChronoBank' target='_blank' styleName='item'>
                  <i className='fa fa-telegram' />
                </a>
                <a href='https://github.com/ChronoBank' target='_blank' styleName='item'>
                  <i className='fa fa-github' />
                </a>
              </div>
            </div>
          </div>
          <div styleName='column-right'>
            <div styleName='form'>
              <h3>Newsletter (coming soon)</h3>
              <div styleName='fields'>
                <TextField
                  hintText='Enter email for news'
                  disabled={true}
                  inputStyle={styles.footer.form.inputStyle}
                  hintStyle={styles.footer.form.hintStyle}
                  fullWidth
                />
              </div>
              <div styleName='actions'>
                <RaisedButton label='Subscribe' disabled={true} />
              </div>
            </div>
          </div>
        </div>
        <div styleName='row'>
          <div styleName='column-left'>
            <div styleName='copyright'>
              <p>Copyright © 2016-2017 Edway Group Pty. Ltd. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
