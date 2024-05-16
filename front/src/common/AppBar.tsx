import * as React from 'react';
import { useEffect, useState } from 'react';
import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar/AppBar";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { drawerWidth } from "./Drawer";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useGetOpen } from "./PageTemplate";
import Link from "@mui/material/Link";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import axios from 'axios';
import Popover from '@mui/material/Popover';
import Divider from "@mui/material/Divider";

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBarComponent = styled(
  MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface INotification {
  id: number;
  face: string;
  message: string;
  created_at: string;
  watched: boolean;
}

export default function AppBar({ toggleDrawer }: { toggleDrawer: () => void }) {
  const open = useGetOpen();
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/main/notifications/')
      .then(response => {
        setNotifications(response.data.results);
      });
  }, []);

  const handleNotificationsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setShowNotifications(!showNotifications);
  };

  const handleNotificationHover = (id: number) => {
    axios.patch(`http://127.0.0.1:8000/api/main/notifications/${id}/`, { watched: true })
      .then(response => {
        setNotifications(notifications.map(notification =>
          notification.id === id ? response.data : notification
        ));
      });
  };

  const unwatchedNotificationsCount = notifications.filter(notification => !notification.watched).length;

  return <AppBarComponent position="absolute" open={open}>
    <Toolbar
      sx={{
        pr: '24px', // keep right padding when drawer closed
      }}
    >
      <Typography
        component="h1"
        variant="h6"
        color="inherit"
        noWrap
        sx={{ flexGrow: 1 }}
      >
        <Link href="/" color="inherit" underline="none">
          REST-Face
        </Link>
      </Typography>
      <IconButton color="inherit" onClick={handleNotificationsClick}>
        <Badge badgeContent={unwatchedNotificationsCount} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List sx={{ width: '300px' }}>
          {notifications.map((notification, index) => (
            <React.Fragment key={notification.id}>
              <ListItem
                onMouseEnter={() => handleNotificationHover(notification.id)}
                sx={{
                  backgroundColor: notification.watched ? 'inherit' : '#fde5a2',
                  maxWidth: '50ch',
                }}
              >
                {notification.message}
              </ListItem>
              {index < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Popover>
    </Toolbar>
  </AppBarComponent>;
}