import React, {Component} from 'react';
import {connect} from 'react-redux';
import PageBase from 'pages/PageBase2';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import globalStyles from '../styles';
import Slider from 'components/common/slider';
import {showLOCModal} from 'redux/ducks/modal';
import {grey400} from 'material-ui/styles/colors';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

const styles = {
    div: {
        padding: 40,
        minWidth: 500,
        paddingBottom: 0
    },
    locName: {
        fontSize: 19,
    },
    lightGrey: {
        color: grey400,
        fontSize: 12,
        padding: '10px 0px',
    },
    ongoing: {
        color: 'green'
    },
    inactive: {
        color: 'gray'
    },
    statusBlock: {
        textAlign: 'right',
        width: 130,
        float: 'right',
    },
    filterBlock: {
        textAlign: 'right'
    },
};

const ongoingStatusBlock = <div style={styles.statusBlock}>
    <div style={styles.ongoing}>
        ACTIVE<br/>
    </div>
    <Slider value={61} cyan={true} />
</div>;

const closedStatusBlock = <div style={styles.statusBlock}>
    <div style={styles.inactive}>
        INACTIVE<br/>
    </div>
    <Slider value={100} disabled={true}/>
</div>;

const dateFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric"
};

const mapStateToProps = (state) => ({
    locs: state.get('locs'),
    locsConnection: state.get('locsConnection'),
});

const mapDispatchToProps = (dispatch) => ({
    showLOCModal: (id) => dispatch(showLOCModal(id))
});

@connect(mapStateToProps, mapDispatchToProps)
class LOCPage extends Component {

    constructor(props) {
        super(props);
        this.state = {value: 1};
    }

    handleChange = (event, index, value) => this.setState({value});

    render() {
        const {showLOCModal, locs} = this.props;
        return (
            <PageBase title={<div><span style={{verticalAlign: 'sub'}}>LOCs </span> <RaisedButton
                        label="NEW LOC"
                        primary={true}
                        style={{verticalAlign: 'text-bottom'}}
                        onTouchTap={showLOCModal}
                        buttonStyle={{...globalStyles.cyanRaisedButton, }}
                        labelStyle={globalStyles.cyanRaisedButtonLabel}
                    />
                </div>}>

                <TextField
                    floatingLabelText="Search by title"
                    style={{width: 'calc(100% - 98px)'}}
                    //fullWidth={true}
                />
                <RaisedButton
                    label="SEARCH"
                    primary={true}
                    buttonStyle={globalStyles.cyanRaisedButton}
                    style={{marginTop: 33, width: 88, float: 'right'}}
                    labelStyle={globalStyles.cyanRaisedButtonLabel}
                    //onTouchTap={this.handleSubmitClick.bind(this)}
                />

                <div style={{ minWidth: 300}}>
                    <span>
                        8 entries
                    </span>
                    <span style={{ float: 'right'}}>
                        <span style={{verticalAlign: 'top'}}>Show only: </span>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={{marginTop: -15}} underlineStyle={{borderTop: 'none',}}>
                            <MenuItem value={1} primaryText="LHUS" />
                            <MenuItem value={2} primaryText="LHEU" />
                            <MenuItem value={3} primaryText="LHAU" />
                        </DropDownMenu>
                        <span style={{verticalAlign: 'top'}}> Sorted by: </span>
                        <DropDownMenu value={this.state.value} onChange={this.handleChange} style={{marginTop: -15}} underlineStyle={{borderTop: 'none',}}>
                            <MenuItem value={1} primaryText="Time added" />
                            <MenuItem value={2} primaryText="Time added" />
                            <MenuItem value={3} primaryText="Time added" />
                        </DropDownMenu>
                    </span>
                </div>

                {locs.items.map(item =>
                    <div key={item.id}>
                        <div style={styles.div}>
                            <div>
                                {item.id === 1 ? ongoingStatusBlock : closedStatusBlock}
                                <div style={styles.locName}>{item.name}</div>
                                <div style={globalStyles.itemGreyText}>
                                    Total issued amount: {item.issueLimit} LHUS<br />
                                    Total redeemed amount: {item.issueLimit} LHUS<br />
                                    Amount in circulation: {item.issueLimit} LHUS<br />
                                    Exp date: {new Date(parseInt(item.expDate)).toLocaleDateString("en-us", dateFormatOptions)}<br />
                                    {item.address}
                                </div>
                                <div style={styles.lightGrey}>
                                    Addad on {new Date(parseInt(item.expDate)).toLocaleDateString("en-us", dateFormatOptions)}
                                </div>
                            </div>
                            <div style={{paddingBottom: 8}}>
                                <FlatButton label="MORE INFO" style={{color: 'grey'}} />
                                <FlatButton label="VIEW CONTRACT" style={{color: 'grey'}} />
                            </div>
                        </div>
                        <Divider style={globalStyles.itemsDivider} />
                    </div>
                )}
            </PageBase>
        );
    }
}

export default LOCPage;
