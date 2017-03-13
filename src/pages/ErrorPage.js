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
            {props.error.message.substr(0, 16) === "CONNECTION ERROR"? <div>
                    <div style={globalStyles.description}>
                        Couldn't connect.
                    </div>
                    <Paper style={styles.paper}>
                        <div>
                            Local ethereum node, mist browser or google chrome with metamask plugin should be used
                        </div>
                    </Paper>
                </div> : <div>
                    {console.error(props.error)}
                    <div style={globalStyles.description}>
                        Something went wrong. Please try again later or contact with administrator.
                    </div>
                    <Paper style={styles.paper}>
                        <div>
                            {props.error.message}
                        </div>
                    </Paper>
                </div>
            },
        </PageBase>
    );
};