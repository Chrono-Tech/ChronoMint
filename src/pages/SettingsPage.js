import React, {Component} from 'react';
import styles from '../styles';
import {
    Tokens,
    CBEAddresses,
    OtherContracts
} from '../components/pages/SettingsPage';

class SettingsPage extends Component {
    render() {
        return (
            <div>
                <span style={styles.navigation}>ChronoMint / Settings</span>

                <Tokens/>

                <div style={styles.paperSpace}></div>

                <CBEAddresses/>

                <div style={styles.paperSpace}></div>

                <OtherContracts/>
            </div>
        );
    }
}

export default SettingsPage;