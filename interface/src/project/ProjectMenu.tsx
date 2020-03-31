import React, { Component } from 'react';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

import {List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

import { PROJECT_PATH } from '../api';

class ProjectMenu extends Component<RouteComponentProps> {

  render() {
    const path = this.props.match.url;
    return (
      <List>
        <ListItem to={`/${PROJECT_PATH}/temp/status`} selected={path.startsWith(`/${PROJECT_PATH}/temp/`)} button component={Link}>
          <ListItemIcon>
            <BeachAccessIcon />
          </ListItemIcon>
          <ListItemText primary="Temperature" />
        </ListItem>
      </List>
    )
  }

}

export default withRouter(ProjectMenu);
