import React, { Component } from 'react';
import './LogBar.css';

class LogBar extends Component {
user = 'not_logged';

  render() {
    const style = {
      backgroundColor: 'white',
      font: 'inherit',
      fontSize: '0.5em',
      listStyle: 'none',
    };

    return (
      <div className="LogBar" style={style}>
        {
        this.user === 'not_logged' ?
          [<div className="not_logged" key={1}>
            <li className="sidebar"><a href="#">Sign In</a></li>
          </div>]
        :
          [<div className="logged" key={2}>
            <li className="sidebar"><a href="#">Account</a></li>
            <li className="sidebar"><a href="#">Log Out</a></li>
          </div>]
        }
      </div>
    );
  }
}

export default LogBar;
