import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import LogBar from './LogBar';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div className="conteneur">
    <App />
    <LogBar />
  </div>,
  document.getElementById('root')
);
registerServiceWorker();

// import React from 'react'
// import ReactDOM from 'react-dom'
// import App from './App'
// import registerServiceWorker from './registerServiceWorker'

// ReactDOM.render(<App />, document.getElementById('root'))
// registerServiceWorker()
