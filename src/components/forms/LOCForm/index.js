import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form/immutable';
import {connect} from 'react-redux';
import { DatePicker } from 'redux-form-material-ui'
import {uploadFileSuccess} from '../../../redux/ducks/ipfs';
import {RaisedButton, IconButton, TextField} from 'material-ui';
import globalStyles from '../../../styles';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import validate from './validate';

const renderTextField = ({ input, label, hint, meta: { touched, error }, ...custom }) => (
    <TextField hintText={hint}
               floatingLabelText={label}
               fullWidth={false}
               errorText={touched && error}
               {...input}
               {...custom}
    />
);

const mapStateToProps = (state) => ({
    ipfs: state.get('ipfs').ipfs,
    initialValues: {
        ...state.get("modal").modalProps.loc,
        expDate: new Date(+state.get("modal").modalProps.loc.expDate)
    }
});

const mapDispatchToProps = (dispatch) => ({
    uploadFileSuccess: (file) => dispatch(uploadFileSuccess(file)),
});

@reduxForm({
    form: 'LOCForm',
    validate,
})
// @connect(mapStateToProps, mapDispatchToProps)
class LOCForm extends Component {
    constructor() {
        super();
        this.state = {
            publishedHashHint: 'file not selected',
            fileSelectButtonStyle: {},
            publishedHashResetButtonStyle: {display: 'none'},
        };
    }

    componentDidMount() {
        if(this.props.loc.publishedHash) {
            this.state = {
                publishedHashHint: '',
                fileSelectButtonStyle: {display: 'none'},
                publishedHashResetButtonStyle: {},
            };
        }
    }

    handleFileSubmit = (files) => {
        if (!files || !files[0]) return;
        const file = files[0];

        const add = (data) => {
            const {node} = this.props.ipfs;
            node.files.add([new Buffer(data)], (err, res) => {
                if (err) {
                    throw err
                }
                if (!res.length){
                    return;
                }
                const hash = res[0].hash;
                this.props.uploadFileSuccess(hash);
                // this.props.change('LOCForm', 'publishedHash', hash);
            });
        };

        if (file.path) {
            add(file.path)
        } else {
            const reader = new window.FileReader();
            reader.onload = () => {
                let data = reader.result;
                add(data);
            };
            // TODO: use array buffers instead of base64 strings
            reader.readAsDataURL(file);
        }
    };

    handleFileChange = (e) => {
        debugger;
        const {input: {onChange}} = this.props;
        onChange('1111111111111111');

        this.setState({
            publishedHashHint: e.target.files[0].name,
            fileSelectButtonStyle: {display: 'none'},
            publishedHashResetButtonStyle: {},
        });
        this.handleFileSubmit(e.target.files);
    };

    handleOpenFileDialog = () => {
        this.refs.fileUpload.click();
    };

    handleResetPublishedHash = () => {
        // this.props.change('LOCForm', 'publishedHash', '');
        this.setState({
            publishedHashHint: 'file not selected',
            fileSelectButtonStyle: {},
            publishedHashResetButtonStyle: {display: 'none'},
        });
    };

    render() {
        const {
            handleSubmit,
        } = this.props;
        return (
            <form onSubmit={handleSubmit}>

                <Field component={renderTextField}
                       name="name"
                       floatingLabelText="LOC title"
                />
                <br />
                <Field component={renderTextField}
                       style={{marginTop: -14}}
                       name="website"
                       hintText="http://..."
                       floatingLabelText="website"
                />
                <div>
                    <RaisedButton
                        label="SELECT FILE"
                        buttonStyle={globalStyles.raisedButton}
                        labelStyle={globalStyles.raisedButtonLabel}
                        primary={true}
                        style={{...this.state.fileSelectButtonStyle, verticalAlign: 'top', marginTop: 10, marginRight: 14}}
                        onTouchTap={this.handleOpenFileDialog}>
                    </RaisedButton>

                    <Field component={renderTextField}
                           name="publishedHash"
                           ref="publishedHash"
                           style={{pointerEvents: 'none'}}
                           hintText={this.state.publishedHashHint}
                    />

                    <IconButton
                        onTouchTap={this.handleResetPublishedHash}
                        style={{...this.state.publishedHashResetButtonStyle, verticalAlign: 'top'}}
                    >
                        <NavigationClose />
                    </IconButton>

                </div>

                <Field component={DatePicker}
                       name="expDate"
                       hintText="Expiration Date"
                       floatingLabelText="Expiration Date"
                />

                <input
                    ref="fileUpload"
                    type="file"
                    style={{display: "none"}}
                    onChange={this.handleFileChange}
                />

                <h3 style={{marginTop: 20}}>Issuance parameters</h3>
                <Field component={renderTextField}
                       style={{marginTop: -8}}
                       name="issueLimit"
                       type="number"
                       floatingLabelText="Allowed to be issued"
                />
                <br />
                <Field component={renderTextField}
                       floatingLabelText="Insurance fee"
                       hintText={"0.0%"}
                       floatingLabelFixed={true}
                       style={{marginTop: -8, pointerEvents: 'none'}}
                />

                <Field component={renderTextField} name="address" style={{display: 'none'}}/>

            </form>
        );
    }
}

LOCForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(LOCForm);

export default LOCForm;