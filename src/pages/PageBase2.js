import React, {PropTypes} from 'react';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import globalStyles from '../styles';

const PageBase = (props) => {
    const {title} = props;

    return (
    <div>
        <Paper style={globalStyles.paper2}>
            <h3 style={globalStyles.title2}>{title}</h3>
            {props.children}
            <div style={globalStyles.clear}/>
        </Paper>
    </div>
    );
};

PageBase.propTypes = {
    title: PropTypes.object,
    children: PropTypes.array
};

export default PageBase;
