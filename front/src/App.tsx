// App.jsx
import React, {FC, useEffect, useState} from 'react';
import {Link, Navigate, redirect, Route, Routes} from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import IUser from "./types/user.type";
import * as AuthService from "./services/auth.service";
import EventBus from "./common/EventBus";
import Recognitions from "./recognitions/Recognitions";
import Camera from "./camera/Camera";
import Faces from "./faces/Faces";
import Settings from "./settings/Settings";
import Login from "./user/Login";
import {getCurrentUser} from "./services/auth.service";
import CameraList from "./camera/CameraList";


const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
   const userIsLogged = getCurrentUser(); // Your hook to get login status

   if (!userIsLogged) {
      return Navigate({to: ("/login")})
   }
   return children;
};

function App() {
  const [showModeratorBoard, setShowModeratorBoard] = useState<boolean>(false);
    const [showAdminBoard, setShowAdminBoard] = useState<boolean>(false);
    const [currentUser, setCurrentUser] = useState<IUser | undefined>(undefined);

    useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
      // setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      // setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
    }, []);

    const logOut = () => {
      AuthService.logout();
      // setShowModeratorBoard(false);
      // setShowAdminBoard(false);
      // setCurrentUser(undefined);
    };

  return (
      <div className="container mt-3">
        <Routes>
            <Route path="/login" element={
                  <Login />
            } />
            <Route path="/" element={
                <RequireAuth>
                    <Dashboard />
                </RequireAuth>
            } />

            <Route path="recognitions/" element={
              <RequireAuth>
                  <Recognitions />
              </RequireAuth>
            } />

            <Route path="camera/" element={
              <RequireAuth>
                  <CameraList />
              </RequireAuth>
            } />

            <Route path="camera/:id" element={
              <RequireAuth>
                  <Camera />
              </RequireAuth>
            } />

            <Route path="faces/" element={
              <RequireAuth>
                  <Faces />
              </RequireAuth>
            } />

            <Route path="settings/" element={
              <RequireAuth>
                  <Settings />
              </RequireAuth>}
            />
        </Routes>
      </div>
  );
}

export default App;