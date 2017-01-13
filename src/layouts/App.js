import React, {Component, PropTypes} from 'react';
import ModalContainer from '../containers/modal';
import Header from '../components/layout/Header/index';
import LeftDrawer from '../components/layout/LeftDrawer/index';
import withWidth, {LARGE, SMALL} from 'material-ui/utils/withWidth';
import Data from '../data';

@withWidth()
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navDrawerOpen: true
        };
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
            padding: '80px 20px 20px 20px',
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