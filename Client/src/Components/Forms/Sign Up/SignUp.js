import React, { Component } from 'react';
import './SignUp.css';
import Popup from './Popup';

class SignUp extends Component {
	state = {
		showPopup: false,
		style: {}
	}

	togglePopup = () => {
		this.state.showPopup ?
		this.setState({
			showPopup: !this.state.showPopup,
			style: {}
		}) :
		this.setState({
			showPopup: !this.state.showPopup,
			style: {
				filter: 'blur(3px)'
			}
		});
	}
	
	render () {
		return (
			<div>
				<div className="display_page" style={this.state.style}>
					<h2>Matchez, Discutez<br />Faites des rencontres.</h2>
					<button className="sign_up" onClick={this.togglePopup.bind(this)}>Sign Up</button>
				</div>
				{this.state.showPopup ?  
					<Popup 
						closePopup={this.togglePopup.bind(this)}  
					/>
				: null }  
			</div>
		);
	}
}

export default SignUp;
