/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import {
    hideModal,
    PROMPT_TYPE,
    REQUIRE_ACCESS_TYPE,
    LOC_TYPE,
    ISSUE_LH_TYPE,
    NEW_POLL_TYPE,
    POLL_TYPE,
    VOTING_DEPOSIT_TYPE,
    SETTINGS_CBE_TYPE,
    SETTINGS_TOKEN_VIEW_TYPE,
    SETTINGS_TOKEN_TYPE,
    IPFS_TYPE,
    REWARDS_TYPE
} from '../redux/ducks/ui/modal.js';
import PromptPassword from '../components/modals/prompt_password';
import RequireAccessModal from '../components/modals/RequireAccessModal';
import LOCModal from '../components/modals/LOCModal';
import IssueLHForm from '../components/modals/IssueLHModal';
import NewPollModal from '../components/modals/NewPollModal';
import PollModal from '../components/modals/poll/PollModal';
import VotingDepositModal from '../components/pages/votingPage/VotingDepositModal';
import SettingsCBEModal from '../components/modals/settings/CBEAddressModal';
import SettingsTokenViewModal from '../components/modals/settings/TokenViewModal';
import SettingsTokenModal from '../components/modals/settings/TokenModal';
import IPFSFileUpload from '../components/modals/IPFSFileUpload';
import RewardsEnablingModal from 'components/modals/RewardsEnablingModal';

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
MODAL_COMPONENTS[REQUIRE_ACCESS_TYPE] = RequireAccessModal;
MODAL_COMPONENTS[LOC_TYPE] = LOCModal;
MODAL_COMPONENTS[ISSUE_LH_TYPE] = IssueLHForm;
MODAL_COMPONENTS[NEW_POLL_TYPE] = NewPollModal;
MODAL_COMPONENTS[POLL_TYPE] = PollModal;
MODAL_COMPONENTS[VOTING_DEPOSIT_TYPE] = VotingDepositModal;
MODAL_COMPONENTS[SETTINGS_CBE_TYPE] = SettingsCBEModal;
MODAL_COMPONENTS[SETTINGS_TOKEN_VIEW_TYPE] = SettingsTokenViewModal;
MODAL_COMPONENTS[SETTINGS_TOKEN_TYPE] = SettingsTokenModal;
MODAL_COMPONENTS[IPFS_TYPE] = IPFSFileUpload;
MODAL_COMPONENTS[REWARDS_TYPE] = RewardsEnablingModal;

export default connect(mapStateToProps, mapDispatchToProps)(
    ({open, modalType, hideModal, modalProps}: propsType) => {
        return MODAL_COMPONENTS[modalType]
            ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
            : null;
    }
);