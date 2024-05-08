import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import Dashboard from "./dashboard/Dashboard";
import Recognitions from "./recognitions/Recognitions";
import Settings from "./settings/Settings";
import Faces from "./faces/Faces";
import Camera from "./camera/Camera";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
);