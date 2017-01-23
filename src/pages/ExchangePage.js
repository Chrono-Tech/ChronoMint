import React, {Component} from 'react';
import {
    ExchangeWidget,
    RatesWidget
} from '../components/pages/ExchangePage';
import globalStyles from '../styles';

class ExchangePage extends Component {
    render() {
        return (
            <div>
                <span style={globalStyles.navigation}>ChronoMint / Exchange</span>
                <div className="row">
                    <div className="col-sm-6">
                        <ExchangeWidget />
                    </div>
                    <div className="col-sm-6">
                        <RatesWidget />
                    </div>
                </div>
            </div>
        );
    }
}

export default ExchangePage;