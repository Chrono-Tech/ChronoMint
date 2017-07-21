import {
  STATUS_MAINTENANCE,
  STATUS_ACTIVE,
  STATUS_SUSPENDED,
  STATUS_BANKRUPT,
  STATUS_INACTIVE
} from '../../../models/LOCModel'

export default {
  [STATUS_MAINTENANCE]: {
    token: 'locs.status.maintenance',
    styleName: 'maintenance'
  },
  [STATUS_ACTIVE]: {
    token: 'locs.status.active',
    styleName: 'active'
  },
  [STATUS_SUSPENDED]: {
    token: 'locs.status.suspended',
    styleName: 'suspended'
  },
  [STATUS_BANKRUPT]: {
    token: 'locs.status.bankrupt',
    styleName: 'bankrupt'
  },
  [STATUS_INACTIVE]: {
    token: 'locs.status.inactive',
    styleName: 'inactive'
  }
}
