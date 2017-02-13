/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import {hideModal, PROMPT_TYPE, LOC_TYPE, CBE_ADDRESS_TYPE, IPFS_TYPE, REWARDS_TYPE} from '../redux/ducks/ui/modal.js';
import PromptPassword from '../components/modals/prompt_password';
import LOCForm from '../components/modals/LOCModal';
import CBEAddressModal from '../components/modals/CBEAddressModal';
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

export let MODAL_COMPONENTS = {};
MODAL_COMPONENTS[PROMPT_TYPE] = PromptPassword;
MODAL_COMPONENTS[LOC_TYPE] = LOCForm;
MODAL_COMPONENTS[CBE_ADDRESS_TYPE] = CBEAddressModal;
MODAL_COMPONENTS[IPFS_TYPE] = IPFSFileUpload;
MODAL_COMPONENTS[REWARDS_TYPE] = rewardsEnablingModal;

export default connect(mapStateToProps, mapDispatchToProps)(
    ({open, modalType, hideModal, modalProps}: propsType) => {
        return MODAL_COMPONENTS[modalType]
            ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
            : null;
    }
);