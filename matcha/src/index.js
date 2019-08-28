import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import LogBar from './LogBar';
// import SignUp from './SignUp';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(
//   <div>
//     <div className="conteneur">
//       <App />
//       <LogBar />
//     </div>
//     <SignUp />
//   </div>,
//   document.getElementById('root')
// );

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

registerServiceWorker();
