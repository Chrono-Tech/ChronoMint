import React, {Component} from 'react';
import {FlatButton} from 'material-ui';
import globalStyles from '../../../styles';
import {votePoll} from '../../../redux/ducks/polls/data';

class Options extends Component {
    handleVote = (pollKey, optionIndex) => {
        votePoll({pollKey, optionIndex}).then(r => alert(' ' + r + ' ' + optionIndex));
    };

    render() {
        const {options, pollKey} = this.props;
        return (
            <div>
                {options.map((option, index) =>
                    <div key={index}>
                        <br/>
                        <FlatButton
                            label={option.description()}
                            style={{...globalStyles.flatButton}}
                            labelStyle={globalStyles.flatButtonLabel}
                            onTouchTap={() => this.handleVote(pollKey, option.index())}
                        />
                    </div>
                )}
            </div>
        );
    }
}

export default Options;