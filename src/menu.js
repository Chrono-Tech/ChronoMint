export default {
  global: [
    {key:'about', title: 'global.about', path: 'https://chronobank.io/#about'},
    {key:'labourHours', title: 'global.labourHours', path: 'https://chronobank.io/#labor-hours'},
    {key:'laborx', title: 'global.laborx', path: 'https://chronobank.io/#laborx'},
    {key:'team', title: 'global.team', path: 'https://chronobank.io/#team'},
    {key:'faq', title: 'global.faq', path: 'https://chronobank.io/faq'},
    {key:'blog', title: 'global.blog', path: 'https://blog.chronobank.io/'}
  ],
  user: [
    {key: 'dashboard', title: 'nav.dashboard', icon: 'dashboard', disabled: true},
    {key: 'wallet', title: 'nav.wallet', icon: 'account_balance_wallet', path: '/new/wallet'},
    {key: 'exchange', title: 'nav.exchange', icon: 'compare_arrows', disabled: true},
    {key: 'voting', title: 'nav.voting', icon: 'done', path: '/new/voting'},
    {key: 'rewards', title: 'nav.rewards', icon: 'card_giftcard', path: '/new/rewards'}
  ],
  cbe: [
    // {key: 'cbeDashboard', title: 'nav.cbeDashboard', icon: 'dashboard', path: '/cbe', disabled: true},
    {key: 'locs', title: 'nav.locs', icon: 'group', path: '/new/cbe/locs'},
    {key: 'pOperations', title: 'nav.operations', icon: 'alarm', path: '/cbe/operations'},
    {key: 'cbeSettings', title: 'nav.settings', icon: 'settings', path: '/cbe/settings'}
  ]
}
