import React, { Component, Fragment } from 'react';

import {restController, RestControllerProps, RestFormLoader, RestFormProps, SectionContent, FormActions, FormButton, } from '../components';
import { ENDPOINT_ROOT } from '../api';

import {ArgumentAxis, ValueAxis, Chart, SplineSeries } from '@devexpress/dx-react-chart-material-ui';
import RefreshIcon from '@material-ui/icons/Refresh';

export const TEMP_READ_ENDPOINT = ENDPOINT_ROOT + "readTemp";

interface TempReads {
    reads: TempRead[]
}

interface TempRead {
    time: number,
    temp: number,
}

type WiFiStatusControllerProps = RestControllerProps<TempReads>;

class WiFiStatusController extends Component<WiFiStatusControllerProps> {

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

export default restController(TEMP_READ_ENDPOINT, WiFiStatusController);

type TempStatusFormProps = RestFormProps<TempReads>;

function timestampToDate(tempRead: TempRead) {
    var date = new Date(tempRead.time * 1000);
    var dateStr = date.toLocaleTimeString()
    return { time: dateStr, temp: tempRead.temp };
}

function TempStatusForm(props: TempStatusFormProps) {
    const { data } = props;
    return (
        <Fragment>
            <Chart data={data.reads.map(timestampToDate)}>
                <SplineSeries
                    argumentField="time"
                    valueField="temp"
                />
                <ArgumentAxis />
                <ValueAxis />
            </Chart>
            <FormActions>
                <FormButton startIcon={<RefreshIcon />} variant="contained" color="secondary" onClick={props.loadData}>
                    Refresh
                </FormButton>
            </FormActions>
        </Fragment>
    );
}