import React, { Component, Fragment } from 'react';

import {restController, RestControllerProps, RestFormLoader, RestFormProps, SectionContent, FormActions, FormButton, } from '../components';
import { ENDPOINT_ROOT } from '../api';

import {ArgumentAxis, ValueAxis, Chart, SplineSeries, Tooltip, ZoomAndPan, Legend } from '@devexpress/dx-react-chart-material-ui';
import RefreshIcon from '@material-ui/icons/Refresh';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Grid } from '@material-ui/core';
import { EventTracker, ValueScale } from '@devexpress/dx-react-chart';

import { redirectingAuthorizedFetch } from '../authentication';

export const TEMP_READ_ENDPOINT = ENDPOINT_ROOT + "readTemp";
export const TEMP_RESET_ENDPOINT = ENDPOINT_ROOT + "resetTemp";

interface TempReads {
    reads: TempRead[],
    temp_unit: string,
}

interface TempRead {
    time: number,
    temp: number,
    hum: number,
}

type TempStatusControllerProps = RestControllerProps<TempReads>;

class TempStatusController extends Component<TempStatusControllerProps> {

  componentDidMount() {
    this.props.loadData();
  }

  render() {
    return (
      <SectionContent title="Temperature Status" titleGutter>
        <RestFormLoader
          {...this.props}
          render={formProps => <TempStatusForm {...formProps} />}
        />
      </SectionContent>
    );
  }

}

export default restController(TEMP_READ_ENDPOINT, TempStatusController);

type TempStatusFormProps = RestFormProps<TempReads>;

function celsiusToFahrenheit(c: number) {
  return (c * 9 / 5) + 32;
}

class TempStatusForm extends Component<TempStatusFormProps> {

  currentTemperature = (data: TempReads) => {
    if(data.reads.length === 0) {
      return "-";
    } else if(data.temp_unit === "fahrenheit") {
      return celsiusToFahrenheit(data.reads[data.reads.length-1].temp/10) + " ºF";
    } else {
      return (data.reads[data.reads.length-1].temp/10) + " ºC";
    }
  }

  currentHumidity = (data: TempReads) => {
    if(data.reads.length === 0) {
      return "-";
    } else {
      return (data.reads[data.reads.length-1].hum/10) + " %";
    }
  }

  getMeasurements = () => {
    const { data } = this.props;

    var preData = data.reads.map(this.preprocess);

    if(data.temp_unit === "fahrenheit")
      preData = preData.map(this.preprocessCtoF);
    
    return preData;
  }

  preprocess(tempRead: TempRead, index: number) {
    return { time: index, temp: tempRead.temp/10, hum: tempRead.hum/10 };
  }

  preprocessCtoF(v: {time: number, temp: number, hum: number}) {
    return { time: v.time, temp: celsiusToFahrenheit(v.temp), hum: v.hum};
  }

  onReset = () => {
    redirectingAuthorizedFetch(TEMP_RESET_ENDPOINT, { method: 'POST' })
        .then(response => {
          if (response.status === 202) {
            this.props.loadData();
          } else {
            throw Error("Invalid status code: " + response.status);
          }
        });
  }

  modifyTempDomain = () =>{
    if(this.props.data.temp_unit === "fahrenheit")
      return [0, 100];
    else
      return [-10, 40];
  }
  modifyHumDomain = () => [0, 100];

  render() {
    const { data, loadData } = this.props;
    return (
      <Fragment>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <ListItem >
              <ListItemAvatar>
                <Avatar>
                  <BeachAccessIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Current Temperature" secondary={this.currentTemperature(data)} />
            </ListItem>
          </Grid>
          <Grid item xs={6}>
            <ListItem >
              <ListItemAvatar>
                <Avatar>
                  <BeachAccessIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary="Current Humidity" secondary={this.currentHumidity(data)} />
            </ListItem>
          </Grid>
          <Grid item xs={12}>
            <Chart data={this.getMeasurements()}>
              <ValueScale name="temperature" modifyDomain={this.modifyTempDomain} />
              <ValueScale name="humidity" modifyDomain={this.modifyHumDomain} />

              <ArgumentAxis />
              <ValueAxis scaleName="temperature" showLine />
              <ValueAxis scaleName="humidity" position="right" showLine />

              <SplineSeries
                  name="Temperature"
                  argumentField="time"
                  valueField="temp"
                  scaleName="temperature"
              />
              <SplineSeries
                  name="Humidity"
                  argumentField="time"
                  valueField="hum"
                  scaleName="humidity"
              />
              <EventTracker />
              <Tooltip />
              <ZoomAndPan />
              <Legend />
            </Chart>
          </Grid>
        </Grid>
        <FormActions>
            <FormButton startIcon={<RefreshIcon />} variant="contained" color="secondary" onClick={loadData}>
              Refresh
            </FormButton>
            <FormButton startIcon={<AutorenewIcon />} variant="contained" color="primary" onClick={this.onReset}>
              Reset
            </FormButton>
        </FormActions>
      </Fragment>
    );
  }
}