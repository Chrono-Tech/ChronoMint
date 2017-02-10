import React from 'react';
import {Link} from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import {grey400} from 'material-ui/styles/colors';
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
    <PageBase title="Create new LOC"
              navigation="Application / New LOC">
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

        <UploadButton/>

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
