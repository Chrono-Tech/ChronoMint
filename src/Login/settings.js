import MnemonicGenerateIcon from 'assets/img/mnemonic-key-color.svg'
import colors from 'styles/themes/variables'
import inverted from 'styles/themes/inversed'
import web3Converter from 'utils/Web3Converter'
import { SESSION_CREATE, SESSION_DESTROY } from 'redux/session/actions'
import theme from 'styles/themes/default'


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
