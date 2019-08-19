import React, { Component } from 'react';
import './SignUp.css';

class SignUp extends Component {
	signUpHandler = () => {
		console.log("signUpHandler triggered !");
	}
	
	render () {
		return (
			<div className="display_page">
				<h2>Matchez, Discutez<br />Faites des rencontres.</h2>
				<li className="sign_up"><a href="#" onClick={this.signUpHandler}>Sign Up</a></li>
			</div>
		);
	}
}

export default SignUp;
