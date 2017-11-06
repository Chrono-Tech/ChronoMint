import MnemonicGenerateIcon from 'assets/img/mnemonic-key-color.svg'
import { SESSION_CREATE, SESSION_DESTROY } from 'redux/session/actions'
import theme from 'styles/themes/default'
import inverted from 'styles/themes/inversed'
import colors from 'styles/themes/variables'
import web3Converter from 'utils/Web3Converter'

export const assets = {
  MnemonicGenerateIcon,
}

export const styles = {
  colors,
  inverted,
  theme,
}

export const utils = {
  web3Converter,
}

export const constants = {
  SESSION_CREATE,
  SESSION_DESTROY,
}
