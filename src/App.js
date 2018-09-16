import React from 'react'
import { ConnectedRouter } from 'connected-react-router/immutable'
import router from './router'

// TODO: Remove it and use https://reacttraining.com/react-router/web/guides/scroll-restoration
const hashLinkScroll = () => {
  const { hash } = window.location
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '')
      const element = document.getElementById(id)
      if (element) element.scrollIntoView()
    }, 0)
  }
}

const App = ({ history, store }) => {
  return (
    <ConnectedRouter history={history} onUpdate={hashLinkScroll}>
      {router(store)}
    </ConnectedRouter>
  )
}

export default App
