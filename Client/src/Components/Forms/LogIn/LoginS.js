/* eslint-disable no-unused-vars */
import React, { Component, useEffect } from 'react';
import cx from 'classnames';

import { UserContext } from '../../../Contexts/UserContext';
import classes from './LogIn.module.css';
import LoginDumb from './LogInD';
const axios = require('axios');
const datas = require('../../../Datas/loginForm.json');

class Login extends Component {
	state = {
		orderForm: datas.orderForm,
		formIsValid: false,
		style: '',
		showPopup: false,
		hidden: true,
		loading: false
	}

	static contextType = UserContext;

	checkValidity(value, rules) {
		let isValid = true;

		if (!rules) {
			return (true);
		}
		if (rules.required) {
			isValid = (value.trim() !== "") && isValid;
		}
		if (rules.minLength) {
			isValid = (value.length >= rules.minLength) && isValid;
		}
		if (rules.maxLength) {
			isValid = (value.length <= rules.maxLength) && isValid;
		}
		if (rules.regex) {
			let regex = RegExp(unescape(rules.regex), 'g')
			isValid = regex.test(value) && isValid;
		}
		return (isValid);
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		updatedFormElement.value = event.target.value;
		updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
		updatedFormElement.touched = true;
		updatedOrderForm[inputIdentifier] = updatedFormElement;

		let formIsValid = true;
		for (let inputIdentifier in updatedOrderForm) {
			formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		}
		this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
	}

	handleChange = (event) => {
		const {name, value} = event.target
		this.setState({[name]: value})
	}

	togglePopup = () => {
		if (this.context.logInPopup)
		{
			this.context.toggleLogInPopup();
			document.getElementById("display_page").style.filter = ''
		}
		else
		{
			this.context.toggleLogInPopup();
			document.getElementById("display_page").style.filter = 'blur(3px)'
		}
	}

	toggleShow = (event, inputIdentifier) => {
		event.preventDefault()
		const newType = this.state.orderForm.password.elementConfig.type === 'password' ? 'text' : 'password';
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		const updatedConfigElement = {
			...updatedFormElement["elementConfig"]
		}
		updatedConfigElement.type = newType;
		updatedOrderForm[inputIdentifier]["elementConfig"] = updatedConfigElement;
		this.setState({ 
			hidden: !this.state.hidden,
			orderForm: updatedOrderForm
		});
	}

	submit = (event) => {
		const { toggleUser } = this.context;
		event.preventDefault();
		this.setState({ loading: true });
		const formDatas = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formDatas[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}

		axios
			.post('http://localhost:4000/API/auth', formDatas)
			.then(response => {
				this.setState({ loading: false })
				if (response.data.success) {
					useEffect(() => {
						console.log(this.context);
						this.context.toggleUser(formDatas.username, response.data.payload);
						this.togglePopup();
						localStorage.setItem('username', this.context.username);
					}, this.context.username);
				}
			})
			.catch(error => {
				this.setState({
					errors: error.response,
					loading: false
				})
				console.log(error)
				return (false);
			})
	}

	render () {
		const { isLoggedIn, username } = this.context;
		return (
			<div className={classes.log}>
				{
					!isLoggedIn ?
					[<div key={1}>
						<button 
							className={cx(classes.sidebar, "btn-sm")} 
							onClick={this.togglePopup.bind(this)}>
							Log In
						</button>
						<LoginDumb
							popup={this.togglePopup.bind(this)}
							handleChange={this.handleChange.bind(this)}
							submit={this.submit.bind(this)}
							toggleShow={this.toggleShow.bind(this)}
							inputChangedHandler={this.inputChangedHandler.bind(this)}
							{...this.state}
							{...this.context}
						/>
					</div>]
					:
					[<div key={2}>
						<h4 className={classes.username}>Welcome back {username} !</h4>
						<div className={classes.buttons}>
							<button className={cx(classes.sidebarLogged, "btn-sm")} >Account</button>
							<button className={cx(classes.sidebarLogged, "btn-sm")} >Log Out</button>
						</div>
					</div>]
				}
			</div>
		)
	}
}

export default Login;
