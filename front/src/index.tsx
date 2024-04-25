import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import Dashboard from "./dashboard/Dashboard";
import {BrowserRouter, Route, Routes} from "react-router-dom";

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
);