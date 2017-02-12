import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form/immutable';
import {connect} from 'react-redux';
import {TextField, DatePicker} from 'redux-form-material-ui'
import {RaisedButton, IconButton} from 'material-ui';
import {change, initialize} from 'redux-form';
import globalStyles from '../../../styles';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {uploadFileSuccess} from '../../../redux/ducks/ipfs/ipfs';
import validate from './validate';

const mapStateToProps = (state) => ({
    ipfs: state.get('ipfs').ipfs,
});

const mapDispatchToProps = (dispatch) => ({
    handleUploadFileSuccess: (file) => dispatch(uploadFileSuccess(file)),
    change: (form, field, value) => dispatch(change(form, field, value)),
    initialize: (form, data) => dispatch(initialize(form, data)),
});

@connect(mapStateToProps, mapDispatchToProps, null, {withRef: true})
@reduxForm({form: 'LOCForm', validate})
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
        if(this.props.loc) {
            this.props.initialize('LOCForm', this.props.loc);
            this.props.change('LOCForm', 'expDate', new Date(this.props.loc.expDate.toNumber()));

            if(this.props.loc.publishedHash) {
                this.state = {
                    publishedHashHint: '',
                    fileSelectButtonStyle: {display: 'none'},
                    publishedHashResetButtonStyle: {},
                };
            }
        } else {
            this.props.change('LOCForm', 'website', 'http://');
            this.props.change('LOCForm', 'name', 'Test1');
            this.props.change('LOCForm', 'website', 'http://www.yandex.ru');
            this.props.change('LOCForm', 'issueLimit', '100500');
            this.props.change('LOCForm', 'publishedHash', '7777777777777');
            this.props.change('LOCForm', 'expDate', new Date(new Date().getTime() + 7776000000));
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
                console.log(hash);
                //this.props.handleUploadFileSuccess(hash);
                //this.props.change('LOCForm', 'publishedHash', hash);
            });
        };

        if (file.path) {
            add(file.path)
        } else {
            const reader = new FileReader();
            reader.onload = () => {
                let data = reader.result;
                add(data);
            };
            // TODO: use array buffers instead of base64 strings
            reader.readAsDataURL(file);
        }
    };

    handleFileChange = (e) => {
        e.preventDefault();
        this.setState({
            value: e.target.files,
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
        this.props.change('LOCForm', 'publishedHash', '');
        this.setState({
            publishedHashHint: 'file not selected',
            fileSelectButtonStyle: {},
            publishedHashResetButtonStyle: {display: 'none'},
        });
    };

    render() {
        const {
            handleSubmit,
            pristine,
            reset,
            submitting
        } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <Field component={TextField}
                       name="name"
                       floatingLabelText="LOC title"
                />
                <br />
                <Field component={TextField}
                       style={{marginTop: -14}}
                       name="website"
                       hintText="http://..."
                       floatingLabelText="website"
                />
                <div>
                    <RaisedButton
                        label="SELECT FILE"
                        buttonStyle={globalStyles.cyanRaisedButton}
                        labelStyle={globalStyles.cyanRaisedButtonLabel}
                        style={{...this.state.fileSelectButtonStyle, verticalAlign: 'top', marginTop: 10, marginRight: 14}}
                        onTouchTap={this.handleOpenFileDialog}>
                    </RaisedButton>

                    <Field component={TextField}
                           name="publishedHash"
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
                       fullWidth={false} />

                <input
                    ref="fileUpload"
                    type="file"
                    style={{display: "none"}}
                    onChange={this.handleFileChange}
                />

                <h3 style={{marginTop: 20}}>Issuance parameters</h3>
                <Field component={TextField}
                       style={{marginTop: -8}}
                       name="issueLimit"
                       type="number"
                       floatingLabelText="Allowed to be issued"
                />
                <br />
                <Field component={TextField}
                       floatingLabelText="Insurance fee"
                       hintText={"0.0%"}
                       floatingLabelFixed={true}
                       style={{marginTop: -8, pointerEvents: 'none'}}
                />

                <Field component={TextField} name="address" style={{display: 'none'}}/>

            </form>
        );
    }
}

export default LOCForm;