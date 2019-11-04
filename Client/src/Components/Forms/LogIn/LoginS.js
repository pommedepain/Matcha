/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import cx from 'classnames';


import { UserContext } from '../../../Contexts/UserContext';
import classes from './LogIn.module.css';
import LoginDumb from './LogInD';
import Account from '../Account/AccountS';
const axios = require('axios');
const datas = require('../../../Datas/loginForm.json');
// const io = require('socket.io');


class Login extends Component {
	state = {
		orderForm: datas.orderForm,
		formIsValid: false,
		style: '',
		showPopup: false,
		hidden: true,
		loading: false,
		alertDesign: null,
		payload: null
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

	handleChange = (event, message) => {
		const {name, value} = event.target
		if (event.type === "click") {
			if (message === "confirm user"){
				// console.log("message === confirm user")
				event.preventDefault();
				this.context.toggleUser(this.state.payload);
				this.setState({
					payload: null,
					alertDesign: null
				})
			}
			else {
				event.preventDefault();
				this.setState({
					alertDesign: null
				});	
			}
		}
		else {
			event.preventDefault();
			this.setState({[name]: value});
		}
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
		event.preventDefault();
		const { toggleUser } = this.context;
		// console.log(event.target)
		this.setState({ 
			loading: true,
			formIsValid: false
		});
		const formDatas = {};
		for (let formElementIdentifier in this.state.orderForm) {
			formDatas[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
		}

		axios
			.post('http://localhost:4000/API/auth', formDatas)
			.then(response => {
				// console.log(response);
				this.setState({ 
					loading: false,
					formIsValid: true
				});
				if (response.data.success) {
					this.setState({
						alertDesign: {
							message:"You are now successfully logged in !",
							button:"OK",
							color: "green",
							function: true,
							logIn: true
						},
						payload: response.data.payload
					}/*, function() {console.log(this.state)}*/);
					
				}
			})
			.catch(error => {
				this.setState({ 
					loading: false,
					formIsValid: true,
					alertDesign: {
						message: "Error.",
						button:"Try Again",
						color: "red"
					}
				});
				console.log(error)
				return (false);
			})
	}

	toggleUser = () => {
		console.log("working");
	}

	render () {
		// console.log(this.context);
		const { isLoggedIn, JWT } = this.context;
		return (
			<div className={classes.log}>
				<div key={1}>
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
						toggleUser={this.toggleUser.bind(this)}
						{...this.state}
						{...this.context}
					/>
				</div>
			</div>
		)
	}
}

export default Login;
