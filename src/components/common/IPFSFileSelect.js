import React, {Component} from 'react';
import {connect} from 'react-redux';
import {IconButton, TextField} from 'material-ui';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import EditorAttachFile from 'material-ui/svg-icons/editor/attach-file';
import IPFSDAO from '../../dao/IPFSDAO';

@connect(null, null)
export default class IPFSFileSelect extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = ({
    //         NavigationCloseIcon: {display: 'none'},
    //         AttachFileIcon: {display: 'none'},
    //     });
    // }

    updateFileIcon() {
        let close = this.refs.fileInput ? this.refs.fileInput.value : this.props.initPublishedHash;
        if (close) {
            this.state = ({
                NavigationCloseIcon: {},
                AttachFileIcon: {display: 'none'},
            });
        } else {
            this.state = ({
                NavigationCloseIcon: {display: 'none'},
                AttachFileIcon: {},
            });
        }
    }

    componentWillMount() {
        this.updateFileIcon();
    }

    handleChange = (e) => {
        const files = e.target.files;
        const onChange = this.props.input.onChange;

        if (!files || !files[0]) return;
        const file = files[0];

        const add = (data) => {
            IPFSDAO.node().files.add([new Buffer(data)], (err, res) => {
                if (err) {
                    throw err
                }
                if (!res.length) {
                    return;
                }
                const hash = res[0].hash;
                this.updateFileIcon();
                // TODO Dispatch upload file success
                onChange(hash);
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

    handleOpenFileDialog = () => {
        this.refs.fileInput.click()
    };

    handleResetPublishedHash = () => {
        this.props.input.onChange('');
        // this.refs.fileUpload.input.value='';
        this.refs.fileInput.value = '';
        this.updateFileIcon();
    };

    render() {
        const {meta: {touched, error}} = this.props;
        const props = {
            type: 'file',
            onChange: this.handleChange,
            style: {display: "none"}
        };
        return (
            <div>
                <TextField
                    onTouchTap={this.handleOpenFileDialog}
                    hintText="Please select a file"
                    ref="fileUpload"
                    style={{cursor: "pointer"}}
                    errorText={touched && error ? error: null}
                    value={this.props.input.value}
                />

                <input ref="fileInput" {...props} />

                <IconButton
                    onTouchTap={this.handleResetPublishedHash}
                    style={{...this.state.NavigationCloseIcon, verticalAlign: 'top'}}
                >
                    <NavigationClose />
                </IconButton>

                <IconButton
                    onTouchTap={this.handleOpenFileDialog}
                    style={{...this.state.AttachFileIcon, verticalAlign: 'top'}}
                >
                    <EditorAttachFile />
                </IconButton>

            </div>
        );
    }
}
