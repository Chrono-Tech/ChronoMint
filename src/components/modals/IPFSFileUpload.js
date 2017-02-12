import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Dialog, RaisedButton, FlatButton} from 'material-ui';

import {uploadFileSuccess} from '../../redux/ducks/ipfs/ipfs';

const mapStateToProps = (state) => ({
    ipfs: state.get('ipfs').ipfs
});

const mapDispatchToProps = (dispatch) => ({
    uploadFileSuccess: (file) => dispatch(uploadFileSuccess(file))
});

@connect(mapStateToProps, mapDispatchToProps)
class IPFSFileUpload extends Component {
    constructor() {
        super();
        this.state = {
            value: null,
            label: 'Choose file',
            uploadedFileHash: null
        }
    }

    handleChange = (e) => {
        this.setState({
            value: e.target.files,
            label: e.target.files[0].name
        });
    };

    handleOpenFileDialog = () => {
        this.refs.fileUpload.click();
    };

    handleSubmit = () => {
        const files = this.state.value;
        if (!files || !files[0]) return;
        const file = files[0];

        const add = (data) => {
            const {node} = this.props.ipfs;
            node.files.add([new Buffer(data)], (err, res) => {
                if (err) {
                    throw err
                }
                const hash = res[0].hash;
                this.props.uploadFileSuccess(hash);
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

    handleClose = () => {
        this.props.hideModal();
    };

    render() {
        const {title, open} = this.props;
        const {uploadedFileHash} = this.state;
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleClose}
            />,
            <RaisedButton
                label="Submit"
                primary={true}
                onTouchTap={this.handleSubmit}
            />,
        ];

        const customContentStyle = {
            minHeight: '400px',
        };
        return (
            <Dialog
                title={title || "Upload file to IPFS"}
                actions={actions}
                modal={true}
                contentStyle={customContentStyle}
                open={open}>
                {
                    uploadedFileHash ?
                        (
                            <div>
                                <span>Uploaded file hash:</span>
                                <br/>
                                <span>{uploadedFileHash}</span>
                            </div>
                        ) : (
                            <RaisedButton
                                label={this.state.label}

                                primary={true}
                                onTouchTap={this.handleOpenFileDialog}>
                            </RaisedButton>
                        )
                }
                <input
                    ref="fileUpload"
                    type="file"
                    style={{display: "none"}}
                    onChange={this.handleChange}/>
            </Dialog>
        );
    }
}

export default IPFSFileUpload;