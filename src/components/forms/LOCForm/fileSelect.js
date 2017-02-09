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

    constructor() {
        super();
        this.state = {
            publishedHashHint: 'Please select a file',
            publishedHashResetButtonStyle: {display: 'none'},
        };
    }

    componentDidMount() {
        if(this.props.loc.publishedHash) {
            this.state = {
                publishedHashHint: '',
                publishedHashResetButtonStyle: {},
            };
        }
    }

    handleFileChange = (e) => {
        debugger;
        const {input: {onChange}} = this.props;
        onChange('1111111111111111');

        this.setState({
            publishedHashHint: e.target.files[0].name,
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
            publishedHashHint: 'Please select a file',
            publishedHashResetButtonStyle: {display: 'none'},
        });
    };

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

    render() {
        // const {
        //
        // } = this.props;
        return (
            <div>
                <TextField
                    //style={{pointerEvents: 'none'}}
                    onTouchTap={this.handleOpenFileDialog}
                    hintText={this.state.publishedHashHint}
                />

                <IconButton
                    onTouchTap={this.handleResetPublishedHash}
                    style={{...this.state.publishedHashResetButtonStyle, verticalAlign: 'top'}}
                >
                    <NavigationClose />
                </IconButton>

                <input
                    ref="fileUpload"
                    type="file"
                    style={{display: "none"}}
                    onChange={this.handleFileChange.bind(this)}
                />
            </div>
        );
    }
}
