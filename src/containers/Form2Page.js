import React from 'react';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import Toggle from 'material-ui/Toggle';
import DatePicker from 'material-ui/DatePicker';
import {grey400} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import PageBase from '../components/PageBase';
import UploadButton from '../components/common/UploadButton';

const FormPage = () => {

  const styles = {
    toggleDiv: {
      maxWidth: 300,
      marginTop: 40,
      marginBottom: 5
    },
    toggleLabel: {
      color: grey400,
      fontWeight: 100
    },
    buttons: {
      marginTop: 30,
      float: 'right'
    },
    saveButton: {
      marginLeft: 5
    }
  };

  return (
    <PageBase title="Edit LOC"
              navigation="LOC Admin / Edit LOC">
      <form>

        <TextField
          hintText="Name"
          floatingLabelText="Name"
          fullWidth={true}
        />

        <TextField
          hintText="Website"
          floatingLabelText="Website"
          fullWidth={true}
        />

        <SelectField
          floatingLabelText="Status"
          value=""
          fullWidth={true}>
          <MenuItem key={0} primaryText="Maitenance"/>
          <MenuItem key={1} primaryText="Active"/>
          <MenuItem key={2} primaryText="Suspended"/>
          <MenuItem key={3} primaryText="Bankrupt"/>
        </SelectField>

        <TextField
            hintText="issueLimit"
            floatingLabelText="issueLimit"
            fullWidth={false}

        />

        <RaisedButton label="Edit"/>

        <div style={styles.buttons}>
          <Link to="/">
            <RaisedButton label="Cancel"/>
          </Link>

          <RaisedButton label="Save"
                        style={styles.saveButton}
                        type="submit"
                        primary={true}/>
        </div>
      </form>
    </PageBase>
  );
};

export default FormPage;
