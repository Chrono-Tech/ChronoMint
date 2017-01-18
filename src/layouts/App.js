import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ModalContainer from '../containers/modal';
import Header from '../components/layout/Header/index';
import LeftDrawer from '../components/layout/LeftDrawer/index';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import Data from '../data';

import {setupIPFSNode} from '../redux/ducks/ipfs';

const mapDispatchToProps = (dispatch) => ({
   setupIPFSNode: () => dispatch(setupIPFSNode())
});

@connect(null, mapDispatchToProps)
@withWidth()
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navDrawerOpen: true
        };
    }

    componentWillMount() {
        this.props.setupIPFSNode();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width) {
            this.setState({navDrawerOpen: nextProps.width === LARGE});
        }
    }

    handleChangeRequestNavDrawer = () => {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen
        });
    };

    render() {
        let {navDrawerOpen} = this.state;
        const paddingLeftDrawerOpen = 230;

        const style = {
            padding: '70px 20px 20px 20px',
            paddingLeft: navDrawerOpen && this.props.width !== SMALL ? paddingLeftDrawerOpen + 20 : 20,
            transition: 'padding 450ms cubic-bezier(0.23, 1, 0.32, 1)'
        };

        return (
            <div>
                <Header drawerOpen={navDrawerOpen}
                        handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer}/>

                <LeftDrawer navDrawerOpen={navDrawerOpen}
                            menus={Data.menus}/>
                <div style={style}>
                    {this.props.children}
                </div>

                <ModalContainer />
            </div>
        );
    }
}

export default App;