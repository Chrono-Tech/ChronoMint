import React, {Component} from 'react';
import {connect} from 'react-redux';
import PageBase from '../pages/PageBase2';
import {getLOCsOnce} from '../redux/ducks/locs/actions';
import {PageTitle, Search, Filter, LocBlock} from '../components/pages/locsPage/';

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
});

const mapDispatchToProps = (dispatch) => ({
    getLOCsOnce: () => dispatch(getLOCsOnce()),
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCsPage extends Component {

    componentWillMount(){
        this.props.getLOCsOnce();
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
