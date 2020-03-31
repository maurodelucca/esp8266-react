import React, { Component } from 'react';
import { RestControllerProps, SectionContent, RestFormLoader, restController, RestFormProps, FormActions, FormButton } from '../components';

import { ENDPOINT_ROOT } from '../api';
import { ValidatorForm, TextValidator, SelectValidator } from 'react-material-ui-form-validator';
import SaveIcon from '@material-ui/icons/Save';
import { MenuItem } from '@material-ui/core';

export const TEMP_SETTINGS_ENDPOINT = ENDPOINT_ROOT + "tempSettings";

interface TempSettings {
    read_frequency: number,
    temp_unit: string,
    dht_pin: number,
    dht_type: string,
}

type TempSettingsControllerProps = RestControllerProps<TempSettings>;

class TempSettingsController extends Component<TempSettingsControllerProps> {

    componentDidMount() {
      this.props.loadData();
    }
  
    render() {
      return (
        <SectionContent title="Temperature Status" titleGutter>
          <RestFormLoader
            {...this.props}
            render={formProps => <TempSettingsForm {...formProps} />}
          />
        </SectionContent>
      );
    }
  
  }

export default restController(TEMP_SETTINGS_ENDPOINT, TempSettingsController);

type TempSettingsFormProps = RestFormProps<TempSettings>;

class TempSettingsForm extends React.Component<TempSettingsFormProps> {

  changeDHTType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { data, setData } = this.props;
    setData({
      ...data,
      dht_type: event.target.value,
    });
  }

  changeTempUnit = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { data, setData } = this.props;
    setData({
      ...data,
      temp_unit: event.target.value,
    });
  }

  render() {
    const { data, saveData, loadData, handleValueChange } = this.props;
    return (
        <ValidatorForm onSubmit={saveData}>
            <TextValidator
              validators={['matchRegexp:^[0-9]+$']}
              errorMessages={['Read Frequency must be a number']}
              name="readFreq"
              label="Read Frequency (sec)"
              fullWidth
              variant="outlined"
              value={data.read_frequency}
              onChange={handleValueChange('read_frequency')}
              margin="normal"
            />
            <SelectValidator
              validators={['required']}
              errorMessages={['Temperature Unit is required']}
              name="temp_unit"
              label="Temperature Unit"
              fullWidth
              variant="outlined"
              value={data.temp_unit}
              onChange={this.changeTempUnit}
              margin="normal"
            >
              <MenuItem disabled>Temperature Unit...</MenuItem>
              <MenuItem value='celsius'>Celsius</MenuItem>
              <MenuItem value='fahrenheit'>Fahrenheit</MenuItem>
            </SelectValidator>
            <SelectValidator
              validators={['required']}
              errorMessages={['DHT Sensor Type is required']}
              name="dht_type"
              label="DHT Sensor Type"
              fullWidth
              variant="outlined"
              value={data.dht_type}
              onChange={this.changeDHTType}
              margin="normal"
            >
              <MenuItem disabled>DHT Sensor Type...</MenuItem>
              <MenuItem value='dht11'>DHT11</MenuItem>
              <MenuItem value='dht12'>DHT12</MenuItem>
              <MenuItem value='dht21'>DHT21</MenuItem>
              <MenuItem value='dht22'>DHT22</MenuItem>
              <MenuItem value='am2301'>AM2301</MenuItem>
            </SelectValidator>
            <TextValidator
              validators={['matchRegexp:^[0-9]{1,2}$']}
              errorMessages={['Pin must be a number']}
              name="dhtPin"
              label="DHT Data Pin"
              fullWidth
              variant="outlined"
              value={data.dht_pin}
              onChange={handleValueChange('dht_pin')}
              margin="normal"
            />
            <FormActions>
                <FormButton startIcon={<SaveIcon />} variant="contained" color="primary" type="submit">
                Save
                </FormButton>
                <FormButton variant="contained" color="secondary" onClick={loadData}>
                Reset
                </FormButton>
            </FormActions>
        </ValidatorForm>
    );
  }
}