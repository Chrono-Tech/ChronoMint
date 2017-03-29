import {typography} from 'material-ui/styles';
import {grey600} from 'material-ui/styles/colors';
import {grey400} from 'material-ui/styles/colors';

const form = {
    firstField: {
        // marginTop: 16, marginBottom: 43
    },
    textField: {
        // marginTop: -38, marginBottom: 43//31
    },
};

const status = {
    block: {
        textAlign: 'right',
        width: 130,
        float: 'right',
    },
    orange: {
        color: 'orange'
    },
    red: {
        color: 'red'
    },
    green: {
        color: 'green'
    },
    grey: {
        color: 'grey'
    },

};

const item = {
    status,
    paper: {
        padding: 38,
        minWidth: 500,
        paddingBottom: 8,
        marginTop: 24,
    },
    title: {
        fontSize: 24
    },
    greyText: {
        color: 'grey',
        fontSize: 12,
        lineHeight: '18px',
        marginTop: 4
    },
    lightGrey: {
        color: grey400,
        fontSize: 15,
        padding: '10px 0px',
    },
};

const styles = {
    item,
    form,
    navigation: {
        fontSize: 15,
        fontWeight: typography.fontWeightLight,
        color: grey600,
        paddingBottom: 15,
        display: 'block'
    },
    title: {
        fontSize: 24,
        fontWeight: typography.fontWeightLight,
        color: '#17579c',
        marginBottom: 20
    },
    paper: {
        padding: 30
    },
    clear: {
        clear: 'both'
    },


    pageBase: {
        padding: 62,
        color: '#212121',
        minWidth: 770
    },
    title2: {
        fontSize: 48,
        fontWeight: typography.fontWeightLight,
        //color: '#17579c',
        marginBottom: 38
    },
    flatButton: {
        lineHeight: 'normal',
        height: 17,
        marginTop: 6,
    },
    flatButtonLabel: {
        fontSize: 12,
        fontWeight: 600,
        padding: 0,
    },
    raisedButton: {
        height: 30,
        lineHeight: '30px',
        fontSize: 15,
    },
    raisedButtonLabel: {
        fontSize: 12,
        fontWeight: 600,
    },
    grayButtonLabel: {
        fontSize: 11,
        color: 'grey',
        padding: 4,
    },
    description: {
        fontWeight: 600,
        lineHeight: 'normal',
    },
    modalGreyText: {
        color: 'grey',
        fontSize: 14,
        lineHeight: '18px',
    },
    paperSpace: {
        marginTop: '20px'
    }
};

export default styles;
