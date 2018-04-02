export default {
  global: [
    { key: 'about', title: 'global.about', path: 'https://chronobank.io/' },
    // { key: 'labourHours', title: 'global.labourHours', path: 'https://chronobank.io/#labor-hours' },
    { key: 'laborx', title: 'global.laborx', path: 'https://chronobank.io/products/laborx' },
    { key: 'team', title: 'global.team', path: 'https://chronobank.io/team' },
    { key: 'faq', title: 'global.faq', path: 'https://chronobank.io/faq' },
    { key: 'blog', title: 'global.blog', path: 'https://blog.chronobank.io/' },
  ],
  user: [
    {
      key: 'dashboard', title: 'nav.dashboard', icon: 'dashboard', path: '/dashboard',
    },
    {
      key: 'exchange', title: 'nav.exchange', icon: 'compare_arrows', path: '/exchange',
    },
    {
      key: 'voting', title: 'nav.voting', icon: 'done', path: '/voting',
    },
    {
      key: 'rewards', title: 'nav.rewards', icon: 'card_giftcard', path: '/rewards',
    },
    {
      key: 'assets', title: 'nav.assets', icon: 'toll', path: '/assets', showMoreButton: true,
    },
  ],
  cbe: [
    // {key: 'cbeDashboard', title: 'nav.cbeDashboard', icon: 'dashboard', path: '/cbe', disabled: true},
    {
      key: 'locs', title: 'nav.locs', icon: 'group', path: '/cbe/locs',
    },
    {
      key: 'pOperations', title: 'nav.operations', icon: 'alarm', path: '/cbe/operations',
    },
    {
      key: 'cbeSettings', title: 'nav.settings', icon: 'settings', path: '/cbe/settings',
    },
  ],
}
