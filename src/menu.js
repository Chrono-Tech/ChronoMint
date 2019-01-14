/**
 * Copyright 2017–2019, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 */

export default {
  global: [
    { key: 'about', title: 'global.about', path: 'https://chronobank.io/' },
    { key: 'laborx', title: 'global.laborx', path: 'https://chronobank.io/products/laborx' },
    { key: 'team', title: 'global.team', path: 'https://chronobank.io/team' },
    { key: 'faq', title: 'global.faq', path: 'https://chronobank.io/faq' },
    { key: 'blog', title: 'global.blog', path: 'https://blog.chronobank.io/' },
  ],
  user: [
    {
      key: 'deposits', title: 'nav.deposits', icon: 'dashboard', path: '/deposits',
    },
    {
      key: 'voting', title: 'nav.voting', icon: 'done', path: '/voting',
    },
    /*{
      key: 'rewards', title: 'nav.rewards', icon: 'card_giftcard', path: '/rewards',
    },*/
    {
      key: 'assets', title: 'nav.assets', icon: 'toll', path: '/assets', showMoreButton: true,
    },
  ],
  cbe: [
    {
      key: 'cbeSettings', title: 'nav.settings', icon: 'settings', path: '/cbe/settings',
    },
  ],
}
