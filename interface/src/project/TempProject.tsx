import React, { Component } from 'react';
import { Redirect, Switch, RouteComponentProps } from 'react-router-dom'

import { Tabs, Tab } from '@material-ui/core';

import { PROJECT_PATH } from '../api';
import { MenuAppBar } from '../components';
import { AuthenticatedRoute } from '../authentication';

import TempStatusController from './TempStatus';
import TempSettingsController from './TempSettings';

class TempProject extends Component<RouteComponentProps> {

  handleTabChange = (event: React.ChangeEvent<{}>, path: string) => {
    this.props.history.push(path);
  };

  render() {
    return (
      <MenuAppBar sectionTitle="Temperature">
        <Tabs value={this.props.match.url} onChange={this.handleTabChange} variant="fullWidth">
          <Tab value={`/${PROJECT_PATH}/temp/status`} label="Status" />
          <Tab value={`/${PROJECT_PATH}/temp/settings`} label="Settings" />
        </Tabs>
        <Switch>
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/temp/status`} component={TempStatusController} />
          <AuthenticatedRoute exact path={`/${PROJECT_PATH}/temp/settings`} component={TempSettingsController} />
          <Redirect to={`/${PROJECT_PATH}/temp/status`} />
        </Switch>
      </MenuAppBar>
    )
  }

}

export default TempProject;
