import MnemonicGenerateIcon from 'assets/img/mnemonic-key-color.svg'
import colors from 'styles/themes/variables'
import inverted from 'styles/themes/inversed'
import LocaleDropDown from 'layouts/partials/LocaleDropDown'
import SessionStorage from "utils/SessionStorage"
import web3Converter from 'utils/Web3Converter'
import ls from 'utils/LocalStorage'
import { SESSION_CREATE, SESSION_DESTROY } from 'redux/session/actions'
import theme from 'styles/themes/default'


export const components = {
  LocaleDropDown
}

export const assets = {
  MnemonicGenerateIcon,
}

export const styles = {
  colors,
  inverted,
  theme
}

export const utils = {
  SessionStorage,
  web3Converter,
  ls
}

export const constants = {
  SESSION_CREATE,
  SESSION_DESTROY
}
