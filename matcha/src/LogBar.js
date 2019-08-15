import React, { Component } from 'react';
import './LogBar.css';

class LogBar extends Component {
	user = "not_logged";

	render() {
		return (
			<div className="LogBar">
				{this.props.user === "not_logged" ?
				<li>Sign-In</li>
				<li>Sign-Up</li>:
				<li>Account</li>
				<li>Log-Out</li>}
			</div>
		)
	}
}

export default LogBar;