import React from 'react';
import Paper from 'material-ui/Paper';
import PageBase from './PageBase2';
import globalStyles from '../styles';

const styles = {
    paper: {
        padding: '50px',
        marginTop: '50px'
    },
};

export default (props) => {
    return (
        <PageBase title={<span>Error</span>}>
            <div style={globalStyles.description}>
                Something went wrong. Please try again later.
            </div>
            <Paper style={styles.paper}>
                <div>
                    {props.error.message}
                </div>
            </Paper>
        </PageBase>
    );
};