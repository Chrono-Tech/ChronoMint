import React, {Component} from 'react';
import {IconButton, TextField} from 'material-ui';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import {uploadFileSuccess} from '../../../redux/ducks/ipfs';
import {connect} from 'react-redux';

const mapStateToProps = (state) => ({
    ipfs: state.get('ipfs').ipfs,
});

const mapDispatchToProps = (dispatch) => ({
    uploadFileSuccess: (file) => dispatch(uploadFileSuccess(file)),
});

@connect(mapStateToProps, mapDispatchToProps)

export default class fileSelect extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if(this.props.loc.publishedHash) {
            this.state = ({
                publishedHashHint: this.props.loc.publishedHash,
                publishedHashResetButtonStyle: {},
            });
        } else {
            this.state = ({
                publishedHashHint: 'Please select a file',
                publishedHashResetButtonStyle: {display: 'none'},
            });
        }
    }

    handleChange = (e) => {
        const files = e.target.files;
        const onChange = this.props.input.onChange;

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
                this.state = ({
                    publishedHashHint: file.name,
                    publishedHashResetButtonStyle: {},
                });
                this.props.uploadFileSuccess(hash);
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
        this.refs.fileUpload.input.click()
    };

    handleResetPublishedHash = () => {
        this.state = ({
            publishedHashHint: 'Please select a file',
            publishedHashResetButtonStyle: {display: 'none'},
        });
        this.props.input.onChange('');
        this.refs.fileUpload.input.value='';
    };

    render() {
        const { meta: { touched, error } } = this.props;
        const props = {
            type: 'file',
            onChange: this.handleChange,
            style: {display: "none"}
        };

        return (
            <div>
                <TextField
                    onTouchTap={this.handleOpenFileDialog}
                    hintText={this.state.publishedHashHint.substring(0, 25)}
                    ref="fileUpload"
                    style={{cursor: "pointer"}}
                    errorText = {touched && error ? error: null}
                >
                    <input {...props} />

                </TextField>

                <IconButton
                    onTouchTap={this.handleResetPublishedHash}
                    style={{...this.state.publishedHashResetButtonStyle, verticalAlign: 'top', marginLeft: -36}}
                >
                    <NavigationClose />
                </IconButton>

            </div>
        );
    }
}
