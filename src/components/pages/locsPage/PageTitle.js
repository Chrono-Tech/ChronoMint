import React, {Component} from 'react';
import {connect} from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import globalStyles from '../../../styles';
import {handleShowLOCModal} from './handlers';

const mapDispatchToProps = (dispatch) => ({
    handleShowLOCModal: locKey => dispatch(handleShowLOCModal(locKey)),
});

@connect(null, mapDispatchToProps)
class PageTitle extends Component {
    render() {
        return (
            <div><span style={{verticalAlign: 'sub'}}>LOCs </span> <RaisedButton
                label="NEW LOC"
                primary={true}
                style={{verticalAlign: 'text-bottom', fontSize: 15}}
                onTouchTap={this.props.handleShowLOCModal.bind(null, null)}
                buttonStyle={{...globalStyles.raisedButton, }}
                labelStyle={globalStyles.raisedButtonLabel}
            />
            </div>
        );
    }
}

export default PageTitle;