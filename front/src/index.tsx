import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import {BrowserRouter} from "react-router-dom";
import './services/axios';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement!);

root.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>
);