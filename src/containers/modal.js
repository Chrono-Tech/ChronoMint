/* @flow */
import React from 'react';
import {connect} from 'react-redux';
import {hideModal} from '../redux/ducks/modal.js';
import PromptPassword from '../components/modals/prompt_password';

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
}

export const MODAL_COMPONENTS = {
    'modals/PROMPT_TYPE': PromptPassword
};

export default connect(mapStateToProps, mapDispatchToProps)(
    ({open, modalType, hideModal, modalProps}: propsType) => {
        console.log(modalProps);
        return MODAL_COMPONENTS[modalType]
            ? React.createElement(MODAL_COMPONENTS[modalType], {open, hideModal, ...modalProps})
            : null;
    }
);