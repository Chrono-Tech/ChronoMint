import React, {Component} from 'react';
import {connect} from 'react-redux';
import Assessment from 'material-ui/svg-icons/action/assessment';
import Face from 'material-ui/svg-icons/action/face';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ShoppingCart from 'material-ui/svg-icons/action/shopping-cart';

import {
    Breadcrumbs,
    TokenUsage,
    InfoBox,
    MonthlySales,
    NewContracts,
    WorkersList,
    LOCsList
} from '../components/pages/DashboardPage';

import Data from '../data';

const mapStateToProps = (state) => ({
    user: state.get('sessionData')
});

@connect(mapStateToProps)
class DashboardPage extends Component {

    render() {
        const cbeWidgets = [
            <div className="row" key="firstRow">
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                    <InfoBox Icon={ShoppingCart}
                             color="#161240"
                             title="Total LHAUs"
                             value="1500k"
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                    <InfoBox Icon={ThumbUp}
                             color="#17579c"
                             title="LOCs"
                             value="28"
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                    <InfoBox Icon={Assessment}
                             color="#4a8fb9"
                             title="Sales"
                             value="460"
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-3 col-lg-3 m-b-15 ">
                    <InfoBox Icon={Face}
                             color="#e2a864"
                             title="New Members"
                             value="2"
                    />
                </div>
            </div>,
            <div className="row" key="secRow">
                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 col-md m-b-15">
                    <NewContracts data={Data.dashBoardPage.newOrders}/>
                </div>

                <div className="col-xs-12 col-sm-6 col-md-6 col-lg-6 m-b-15">
                    <MonthlySales data={Data.dashBoardPage.monthlySales}/>
                </div>
            </div>,
            <div className="row" key="thirdRow">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                    <LOCsList data={Data.dashBoardPage.LOCsList}/>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                    <TokenUsage data={Data.dashBoardPage.browserUsage}/>
                </div>
            </div>
        ];

        const locWidgets = [
            <div className="row" key="firstRow">
                <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 m-b-15 ">
                    <InfoBox Icon={ShoppingCart}
                             color="#161240"
                             title="Issued LHT"
                             value="1500k"
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                    <InfoBox Icon={ThumbUp}
                             color="#17579c"
                             title="Used LHT"
                             value="180k"
                    />
                </div>
                <div className="col-xs-12 col-sm-6 col-md-4 col-lg-4 m-b-15 ">
                    <InfoBox Icon={Assessment}
                             color="#4a8fb9"
                             title="Free LHT"
                             value="1320k"
                    />
                </div>
            </div>,
            <div className="row" key="secRow">
                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                    <WorkersList data={Data.dashBoardPage.WorkersList}/>
                </div>

                <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 m-b-15 ">
                    <TokenUsage data={Data.dashBoardPage.browserUsage}/>
                </div>
            </div>
        ];

        return (
            <div>
                <Breadcrumbs />
                {this.props.user.profile.type === 'loc' ? locWidgets : cbeWidgets}

            </div>
        );
    }
}

export default DashboardPage;
