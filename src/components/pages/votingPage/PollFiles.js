import React, {Component} from 'react';
import globalStyles from '../../../styles';

class PollFiles extends Component {
    render() {
        const {files} = this.props;
        return (
            <div style={globalStyles.item.lightGrey}>
                Files:
                {files.map( file => {
                    return (<div key={file.index}>
                        {file.hash}
                    </div>)
                })}
            </div>
        );
    }
}

export default PollFiles;