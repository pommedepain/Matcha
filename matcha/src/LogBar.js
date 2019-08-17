import React, { Component } from 'react';
import './LogBar.css';

class LogBar extends Component {
user = 'not_logged';

render() {
  const style = {
    backgroundColor: 'white',
    font: 'inherit',
    fontSize: '0.5em',
    border: '1px solid white',
    borderRadius: '15px',
    listStyle: 'none',
    textDecoration: 'none'
  };

  return (
    <div className="LogBar" style={style}>
      {
this.user === 'not_logged' ?
[<div className="not_logged">
  <li><a href="#">Sign In</a></li>
  <li><a href="#">Sign Up</a></li>
</div>
]
:
[<div className="logged">
  <li><a href="#">Account</a></li>
  <li><a href="#">Log Out</a></li>
</div>
]
      }
    </div>
  );
}
}

export default LogBar;
