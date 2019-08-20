import React, { Component } from 'react';
import './SignUp.css';
import Popup from './Popup';

class SignUp extends Component {
	constructor(props){
		super(props);
		this.state = {showPopup: false};
	}

	togglePopup(){
		this.setState({
			showPopup: !this.state.showPopup
		});
	}
	
	render () {
		return (
			<div className="display_page">
				<h2>Matchez, Discutez<br />Faites des rencontres.</h2>
				<li className="sign_up"><a onClick={this.togglePopup.bind(this)}>Sign Up</a></li>
				{this.state.showPopup ?  
					<Popup 
						ClosePopup={this.togglePopup.bind(this)}  
					/>  
				: null }  
			</div>
		);
	}
}

export default SignUp;
