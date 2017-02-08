import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ModalContainer from '../containers/modal';
import Header from '../components/layout/Header/index';
import LeftDrawer from '../components/layout/LeftDrawer/index';
import withWidth, {LARGE} from 'material-ui/utils/withWidth';
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
            navDrawerOpen: props.width === LARGE,
            navDrawerDocked: props.width === LARGE
        };
    }

    componentWillMount() {
        this.props.setupIPFSNode();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.width !== nextProps.width) {
            this.setState({
                navDrawerDocked: nextProps.width === LARGE
            });
        }

        // Close drawer on small screen when opened another page
        if (this.props.location.pathname != nextProps.location.pathname && nextProps.width !== LARGE) {
            this.setState({
                navDrawerOpen: nextProps.width === LARGE
            });
        }
    }

    handleChangeRequestNavDrawer = () => {
        this.setState({
            navDrawerOpen: !this.state.navDrawerOpen
        });
    };

    render() {
        let {navDrawerOpen, navDrawerDocked} = this.state;
        const paddingLeftDrawerOpen = 230;
        const paddingLeft = this.props.width < LARGE ? 0 :
            (navDrawerOpen ? paddingLeftDrawerOpen : 56);

        const style = {
            padding: '70px 20px 20px 20px',
            paddingLeft: paddingLeft + 20,
            transition: 'padding 450ms cubic-bezier(0.23, 1, 0.32, 1)'
        };

        return (
            <div>
                <Header handleChangeRequestNavDrawer={this.handleChangeRequestNavDrawer}/>

                <LeftDrawer navDrawerOpen={navDrawerOpen} navDrawerDocked={navDrawerDocked}
                            navDrawerChange={(open) => this.setState({navDrawerOpen: open})}
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