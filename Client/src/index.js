import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import classes from './index.module.css';
import App from './Containers/App';

ReactDOM.render(
<div className={classes.conteneur}>
  <App />
</div>,
  document.getElementById('root')
);

registerServiceWorker();
