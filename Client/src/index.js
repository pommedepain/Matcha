import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import UserContextProvider from './Contexts/UserContext';
import classes from './index.module.css';
import App from './Containers/App';

ReactDOM.render(
<div className={classes.conteneur}>
  <UserContextProvider>
    <App />
  </UserContextProvider>
</div>,
  document.getElementById('root')
);

registerServiceWorker();
