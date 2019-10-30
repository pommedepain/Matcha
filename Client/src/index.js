import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import classes from './index.module.css';
import App from './Containers/App';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:5000');
const username = '';
if (localStorage.getItem('JWT') && localStorage.getItem('JWT').data) username = localStorage.getItem('JWT').data.username;
socket.emit('LoginUser', username);

ReactDOM.render(
<div className={classes.conteneur}>
  <App />
</div>,
  document.getElementById('root')
);

registerServiceWorker();
