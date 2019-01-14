/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

import React, { PureComponent } from 'react'
import { Map } from 'immutable'
import SidePanel from 'layouts/partials/SidePanel/SidePanel'

// Here we have a list of [[ALL]] side panels.
// Keep imports alphabetically sorted
import MenuAssetsManagerMoreInfo from 'layouts/partials/DrawerMainMenu/MenuAssetsManagerMoreInfo/MenuAssetsManagerMoreInfo'
import MenuTokenMoreInfo from 'layouts/partials/DrawerMainMenu/MenuTokenMoreInfo/MenuTokenMoreInfo'
import NotificationContent from 'layouts/partials/NotificationContent/NotificationContent'
import ProfileContent from 'layouts/partials/ProfileContent/ProfileContent'

export default class SideSelector extends PureComponent {
  // Keep Map alphabetically sorted
  static sidesMap = new Map({
    'MenuAssetsManagerMoreInfo': MenuAssetsManagerMoreInfo,
    'MenuTokenMoreInfo': MenuTokenMoreInfo,
    'NotificationContent': NotificationContent,
    'ProfileContent': ProfileContent,
  })

  static getSide (sideProps) {
    if (!sideProps || !sideProps.componentName) {
      // throw new Error('componentName is mandatory property for the SideSelector')
      // eslint-disable-next-line no-console
      console.warn('SideSelector Error: Cant\'t display side by data:', sideProps)
      return null // return null is safe since React 16.x
    }

    const Side = SideSelector.sidesMap.get(sideProps.componentName)
    if (Side) {
      return (
        <SidePanel
          key={sideProps.panelKey}
          component={Side}
          {...sideProps}
        />
      )
    } else {
      return null // return null is safe since React 16.x
    }
  }

  render () {
    return SideSelector.getSide(this.props)
  }
}
