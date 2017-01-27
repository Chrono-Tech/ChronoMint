/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import {hideModal} from '../redux/ducks/modal.js';
import PromptPassword from '../components/modals/prompt_password';
import LOCForm from '../components/modals/LOCModal';
import IPFSFileUpload from '../components/modals/IPFSFileUpload';
import rewardsEnablingModal from 'components/modals/rewardsEnablingModal';

const mapDispatchToProps = (dispatch) => ({
    hideModal: () => dispatch(hideModal())
});

const mapStateToProps = (state) => {
    const {open, modalType, modalProps} = state.get('modal');
    return {
        open,
        modalType,
        modalProps
    };
};

type propsType = {
    open: boolean,
    modalType: string,
    hideModal: Function,
    modalProps: Object
};

export const MODAL_COMPONENTS = {
    'modals/PROMPT_TYPE': PromptPassword,
    'modals/LOC_TYPE': LOCForm,
    'modals/IPFS_TYPE': IPFSFileUpload,
    'modals/REWARDS_TYPE': rewardsEnablingModal
};

export default connect(mapStateToProps, mapDispatchToProps)(
    ({open, modalType, hideModal, modalProps}: propsType) => {
        return MODAL_COMPONENTS[modalType]
            ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
            : null;
    }
);