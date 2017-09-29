import React from 'react'

import { RaisedButton, TextField } from 'material-ui'
import { Translate } from 'react-redux-i18n'

import BrandLogo from '../BrandLogo/BrandLogo'
import menu from 'menu'

import styles from '../styles'
import './FooterPartial.scss'

export default class FooterPartial extends React.Component {
  render () {
    return (
      <div styleName='root'>
        <div styleName='row'>
          <div styleName='columnLeft'>
            <div styleName='papers'>
              <h2><BrandLogo /></h2>
              <ul styleName='papersList'>
                <li styleName='papersListItem'><a href='https://chronobank.io/files/business_outline.pdf' target='_blank' rel='noopener noreferrer'><Translate value='layouts.partials.FooterPartial.download'/></a> Business outline</li>
                <li styleName='papersListItem'><a href='https://chronobank.io/files/dev_plan.pdf' target='_blank' rel='noopener noreferrer'><Translate value='layouts.partials.FooterPartial.download'/></a> Development plan</li>
                <li styleName='papersListItem'><a href='https://chronobank.io/files/whitepaper.pdf' target='_blank' rel='noopener noreferrer'><Translate value='layouts.partials.FooterPartial.download'/></a> White paper</li>
              </ul>
            </div>
          </div>
          <div styleName='columnCenter'>
            <div styleName='menu'>
              <h3><Translate value='layouts.partials.FooterPartial.menu'/></h3>
              <ul styleName='menuList'>
                {menu.global.map(item => (
                  <li key={item.key} styleName='menuListItem'>
                    <a href={item.path} target='_blank' rel='noopener noreferrer'><Translate value={item.title} /></a>
                  </li>
                ))}
              </ul>
            </div>
            <div styleName='contacts'>
              <h3><Translate value='layouts.partials.FooterPartial.contactUs'/></h3>
              <div>
                <div styleName='contactsItem'>
                  <div styleName='title'><Translate value='layouts.partials.FooterPartial.technicalSupport'/>:</div>
                  <div styleName='link'><a href='mailto:support@chronobank.io'>support@chronobank.io</a></div>
                </div>
                <div styleName='contactsItem'>
                  <div styleName='title'><Translate value='layouts.partials.FooterPartial.generalInquiries'/>:</div>
                  <div styleName='link'><a href='mailto:info@chronobank.io'>info@chronobank.io</a></div>
                </div>
              </div>
            </div>
            <div styleName='social'>
              <h3><Translate value='layouts.partials.FooterPartial.socialNetwork'/></h3>
              <div styleName='socialItems'>
                <a href='https://www.facebook.com/ChronoBank.io' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-facebook' />
                </a>
                <a href='https://twitter.com/ChronobankNews' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-twitter' />
                </a>
                <a href='https://www.instagram.com/chronobank.io/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-instagram' />
                </a>
                <a href='https://www.reddit.com/r/ChronoBank/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-reddit-alien' />
                </a>
                <a href='https://chronobank.herokuapp.com/' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-slack' />
                </a>
                <a href='https://telegram.me/ChronoBank' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-telegram' />
                </a>
                <a href='https://github.com/ChronoBank' target='_blank' rel='noopener noreferrer' styleName='socialItem'>
                  <i className='fa fa-github' />
                </a>
              </div>
            </div>
          </div>
          <div styleName='columnRight'>
            <div styleName='form'>
              <h3><Translate value='layouts.partials.FooterPartial.newsletter'/></h3>
              <div styleName='fields'>
                <TextField
                  hintText={<Translate value='layouts.partials.FooterPartial.enterEmailForNews'/>}
                  disabled={true}
                  inputStyle={styles.footer.form.inputStyle}
                  hintStyle={styles.footer.form.hintStyle}
                  fullWidth
                />
              </div>
              <div styleName='actions'>
                <RaisedButton label={<Translate value='layouts.partials.FooterPartial.subscribe'/>} disabled={true} />
              </div>
            </div>
          </div>
        </div>
        <div styleName='row'>
          <div styleName='columnLeft'>
            <div styleName='copyright'>
              <p>Copyright © 2016-2017 Edway Group Pty. Ltd. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
