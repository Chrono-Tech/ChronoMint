import React, {Component} from 'react';
import {connect} from 'react-redux';
import PageBase from '../pages/PageBase2';
import {getLOCs} from '../redux/ducks/locs/actions';
import {PageTitle, Search, Filter, LocBlock} from '../components/pages/locsPage/';

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
    isNeedReload:  state.get('locsCommunication').isNeedReload,
});

const mapDispatchToProps = (dispatch) => ({
    getLOCs: (account) => dispatch(getLOCs(account)),
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCsPage extends Component {

    componentWillMount(){
        if (this.props.isNeedReload) {
            this.props.getLOCs(localStorage.chronoBankAccount);
        }
    }

    render() {
        const {locs} = this.props;
        return (
            <PageBase title={<PageTitle handleShowLOCModal={this.handleShowLOCModal} />}>

                <Search />

                <Filter locs={locs}/>

                {locs.map( (loc, key) => <LocBlock key={key} loc={loc}/>).toArray()}

            </PageBase>
        );
    }
}

export default LOCsPage;
