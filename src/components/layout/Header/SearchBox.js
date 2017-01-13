import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {white, darkWhite} from 'material-ui/styles/colors';

class SearchBox extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.refs.search.focus();
    }

    render() {
        const styles = {
            textField: {
                color: white,
                backgroundColor: 'transparent',
                borderRadius: 0,
            },
            inputStyle: {
                color: white,
                height: 56,
                fontSize: 20
            },
            hintStyle: {
                height: 20,
                fontSize: 20,
                color: darkWhite
            }
        };

        return (
            <TextField
                ref="search"
                hintText="Search..."
                underlineShow={false}
                fullWidth={true}
                style={styles.textField}
                inputStyle={styles.inputStyle}
                hintStyle={styles.hintStyle}
            />
        );
    }
}

export default SearchBox;
