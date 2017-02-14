import React, {Component} from 'react';
import globalStyles from '../styles';
import {
    Tokens,
    CBEAddresses
} from '../components/pages/SettingsPage';

const space = {marginTop: 20};

class SettingsPage extends Component {
    render() {
        return (
            <div>
                <span style={globalStyles.navigation}>ChronoMint / Settings</span>

                <Tokens/>

                <div style={space}></div>

                <CBEAddresses/>
            </div>
        );
    }
}

export default SettingsPage;