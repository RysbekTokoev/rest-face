import * as React from 'react';
import {createContext, useContext, useEffect, useState} from 'react';
import AppBar from "./AppBar";
import Drawer from "./Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Toolbar from "@mui/material/Toolbar";
import IUser from "../../react-typescript-authentication-example/src/types/user.type";
import * as AuthService from "../../react-typescript-authentication-example/src/services/auth.service";
import EventBus from "../../react-typescript-authentication-example/src/common/EventBus";


const Context = createContext<boolean>(true);
export const useGetOpen = () => useContext(Context);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        Rest Face
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


export default function PageTemplate({children}: {children: React.ReactNode}) {
    const [open, setOpen] = React.useState(false);
    function toggleDrawer() {
        setOpen(!open);
    }

    return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Context.Provider value={open}>
                <AppBar toggleDrawer={toggleDrawer}/>
                <Drawer toggleDrawer={toggleDrawer}/>
            </Context.Provider>)
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
            <Toolbar />
            {children}
            <Copyright sx={{ pt: 4 }} />
          </Box>
        </Box>
      </ThemeProvider>
    )
}