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
import VisibilityIcon from '@mui/icons-material/Visibility';

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
    <ListButton url="/" text="Главная" icon={<DashboardIcon/>} />
    <ListButton url="/recognitions/" text="Распознавания"  icon={<VisibilityIcon/>} />
    <ListButton url="/camera/" text="Камера" icon={<CameraIcon/>} />
    <ListButton url="/faces/" text="Лица" icon={<PersonIcon/>} />
    <ListButton url="/settings/" text="Настройки"  icon={<SettingsIcon/>} />
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Сохраненные отчеты
    </ListSubheader>
    <ListButton url="/" text="За день" icon={<AssignmentIcon/>}/>
    <ListButton url="/" text="За месяц" icon={<AssignmentIcon/>}/>
    <ListButton url="/" text="За год" icon={<AssignmentIcon/>}/>
  </React.Fragment>
);
