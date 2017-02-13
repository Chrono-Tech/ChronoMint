import {typography} from 'material-ui/styles';
import {grey600} from 'material-ui/styles/colors';

const styles = {
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
    itemsPaper: {
        padding: 38,
        minWidth: 500,
        paddingBottom: 8,
        marginTop: 24,
    },
    flatButton: {
        lineHeight:'normal',
        height:17,
        marginTop:6,
    },
    flatButtonLabel: {
        fontSize: 12,
        fontWeight: 600,
        padding: 0,
    },
    raisedButton: {
        height:30,
        lineHeight: '30px',
        fontSize:15,
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
        lineHeight:'normal',
    },
    itemTitle: {
        fontSize: 20
    },
    itemGreyText: {
        color: 'grey',
        fontSize: 12,
        lineHeight: '18px',
        marginTop: 4
    },
    modalGreyText: {
        color: 'grey',
        fontSize: 14,
        lineHeight: '18px',
    },


};

export default styles;
