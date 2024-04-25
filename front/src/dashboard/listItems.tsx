import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CameraIcon from '@mui/icons-material/Camera';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';

function ListButton({url, text, icon}: {url: string, text: string, icon: any}){
    return <a href={url} style={{
        textDecoration: 'none',
        color: 'inherit'
    }}>
        <ListItemButton>
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={text}/>
        </ListItemButton>
    </a>
};

export const mainListItems = (
  <React.Fragment>
    <ListButton url="/" text="Dashboard" icon={<DashboardIcon/>} />
    <ListButton url="/camera" text="Camera" icon={<CameraIcon/>} />
    <ListButton url="/face" text="Face" icon={<PersonIcon/>} />
    <ListButton url="/settings" text="Settings"  icon={<SettingsIcon/>} />
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Saved reports
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItemButton>
  </React.Fragment>
);
