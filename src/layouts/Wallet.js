import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ModalContainer from '../containers/modal';
import Header from '../components/layout/Header/index';
import withWidth from 'material-ui/utils/withWidth';

//@connect(null, mapDispatchToProps)
@withWidth()
class Wallet extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const style = {
            padding: '70px 20px 20px 20px',
            paddingLeft: 20,
        };

        return (
            <div>
                <Header drawerOpen={false} />

                <div style={style}>
                    {this.props.children}
                </div>

                <ModalContainer />
            </div>
        );
    }
}

export default Wallet;