import React, { Component } from 'react';
import './LogBar.css';	import './LogBar.css';

class LogBar extends Component {
	user = 'not_logged';
	
	render() {
		const style = {
			backgroundColor: 'white',
			font: 'inherit',
			fontSize: '0.5em',
			listStyle: 'none'
		}

		return (
			<div className="LogBar" style={style}>
			{
				this.user === 'not_logged' ?
				[<div className="not_logged" key={1}>
					<button className="sidebar">Log In</button>
				</div>]
				:
				[<div className="logged" key={2}>
					<button className="sidebar">Account</button>
					<button className="sidebar">Log Out</button>
				</div>]
			}
			</div>
		);
	}
}

export default LogBar;
