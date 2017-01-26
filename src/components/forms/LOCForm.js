import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form/immutable';
import {connect} from 'react-redux';
import { TextField, DatePicker} from 'redux-form-material-ui'
import {uploadFileSuccess} from '../../redux/ducks/ipfs';
import {RaisedButton} from 'material-ui';
import { change } from 'redux-form';

const mapStateToProps = (state) => ({
    ipfs: state.get('ipfs').ipfs
});

const mapDispatchToProps = (dispatch) => ({
    uploadFileSuccess: (file) => dispatch(uploadFileSuccess(file)),
    change: (form, field, value) => dispatch(change(form, field, value))
});

@connect(mapStateToProps, mapDispatchToProps)

class LOCForm extends Component {
    constructor() {
        super();
        this.state = {
            loc: {
                status: null
            },
            value: null,
            uploadedFileHash: '',
            chooseFileLabel: 'Choose file'
        }
    }

    handleFileSubmit = (files) => {
        //const files = this.state.value;
        if (!files || !files[0]) return;
        const file = files[0];

        const add = (data) => {
            const {node} = this.props.ipfs;
            node.files.add([new Buffer(data)], (err, res) => {
                if (err) {
                    throw err
                }
                if (!res.length){
                    throw "EMPTY res";
                }
                const hash = res[0].hash;
                this.props.uploadFileSuccess(hash);
                this.props.change('LOCForm', 'uploadedFileHash', hash);
                this.setState({
                    uploadedFileHash: hash
                });
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
        this.setState({
            value: e.target.files,
            chooseFileLabel: e.target.files[0].name
        });
        this.handleFileSubmit(e.target.files);
    };

    handleOpenFileDialog = () => {
        this.refs.fileUpload.click();
    };

    render() {
        const {
            handleSubmit
        } = this.props;
        return (
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="col-sm-6 col-md-6">
                        <Field component={TextField}
                               name="name"
                               floatingLabelText="Name"
                               fullWidth={true} />

                        <Field component={TextField}
                               name="issueLimit"
                               floatingLabelText="Issue Limit"
                               fullWidth={true} />

                    </div>

                    <div className="col-sm-6 col-md-6">
                        <Field component={DatePicker}
                               name="expiration_date"
                               hintText="Expiration Date"
                               floatingLabelText="Expiration Date"
                               fullWidth={true} />


                    </div>
                </div>
                <RaisedButton
                    label={this.state.chooseFileLabel}
                    primary={true}
                    onTouchTap={this.handleOpenFileDialog}>
                </RaisedButton>
                <input
                    ref="fileUpload"
                    type="file"
                    style={{display: "none"}}
                    onChange={this.handleFileChange}/>
{/*
                <RaisedButton
                    label="Submit"
                    primary={true}
                    onTouchTap={this.handleFileSubmit}
                />
*/}
                <Field component={TextField}
                       name="uploadedFileHash"
                       floatingLabelText={this.state.uploadedFileHash}
                       value={this.state.uploadedFileHash}
                       fullWidth={true} />

            </form>
        );
    }
}

LOCForm = reduxForm({
    form: 'LOCForm',
})(LOCForm);

export default LOCForm;