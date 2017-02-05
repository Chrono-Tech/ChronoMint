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


    paper2: {
        padding: 62,
        color: '#212121'
    },
    title2: {
        fontSize: 48,
        fontWeight: typography.fontWeightLight,
        //color: '#17579c',
        marginBottom: 38
    },
    cyanFlatButton: {
        lineHeight:'normal',
        height:17,
        marginTop:6,
    },
    cyanFlatButtonLabel: {
        fontSize: 12,
        color: '#009688',
        fontWeight: 600,
        padding: 0,
    },
    cyanRaisedButton: {
        height:30,
        lineHeight: '30px',
        backgroundColor: '#009688',
        fontSize:15,
    },
    cyanRaisedButtonLabel: {
        fontSize: 12,
        fontWeight: 600,
        color: 'white',
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
    itemBlock: {
        padding: 38,
        paddingBottom: 0,
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
    itemsDivider: {
        height: 2,
    },



};

export default styles;
