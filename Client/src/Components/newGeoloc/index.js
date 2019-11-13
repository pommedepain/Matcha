import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';

// examples:
import Home from './Home';
import Main from './examples/Main';
import Heatmap from './examples/Heatmap';
import SearchBox from './examples/Searchbox';
import MyCustomComponent from './examples/MyCustomComponent';
import MarkerInfoWindow from './examples/MarkerInfoWindow';
import MarkerInfoWindowGmapsObj from './examples/MarkerInfoWindowGmapsObj';

// styles
import './index.css';

// components
import App from './App';

// utils
import registerServiceWorker from './registerServiceWorker';

const defaultPath = process.env.REACT_APP_BASE_PATH;

ReactDOM.render(
  <Router>
    <App>

        <Route path={`${defaultPath}`} component={MyCustomComponent} />

    </App>
  </Router>,
  document.getElementById('root'),
);

registerServiceWorker();
