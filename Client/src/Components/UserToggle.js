import React, { Component } from 'react';
import { UserContext } from '../Contexts/UserContext';

class UserToggle extends Component {
	static contextType = UserContext;

	render () {
		const { toggleUser } = this.context;

		return (
			<button 
				onClick={() => { toggleUser(); this.props.togglePopup()}}
				className={this.props.className}
			>
			{this.props.buttonMessage}
			</button>
		);
	}
}

export default UserToggle;
