import React, { Component } from 'react';
import cx from 'classnames';

import classes from './Account.module.css';
import AccountDumb from './AccountD';
import { UserContext } from '../../../Contexts/UserContext';

const formDatas = require('../../../Datas/accountForm.json');
const axios = require('axios');

class Account extends Component {
	state = {
		orderForm: formDatas.orderForm,
		emails: null,
		formIsValid: false,
		range: [18, 25],
		rangeTouched: false,
		localisation: 5,
		sliderTouched: false,
		tags: [
			{ id: "athlete", text: "Athlete" },
			{ id: "geek", text: "Geek" }
		],
		touched: false,
		password: formDatas.password,
		cPasswd: formDatas.cPasswd,
		erros: [],
		retSubmit: null
	}

	static contextType = UserContext;

	getEmails = () => {
		axios.get(`http://localhost:4000/API/users/email`)
			.then(response => {
				// console.log(response.data.payload.users);
				this.setState({ emails: response.data.payload.users });
			})
			.catch(err => { 
				console.log(err);
			})
	}

	checkValidity(value, rules, inputIdentifier, state) {
		return new Promise (function (resolve, reject) {
			let isValid = true;
			let errorMessages = [];

			if (!rules) {
				resolve(true);
			}
			if (rules.required === true) {
				isValid = (value.trim() !== "") && isValid;
				if (inputIdentifier !== undefined && value.trim() === "")
				{	
					errorMessages.push("This field is required");
					reject(errorMessages);
				}
			}
			if (!rules.required) {
				if ((value.trim() === "")) {
					resolve(true);
				}
			}
			if (rules.minLength) {
				isValid = (value.length >= rules.minLength) && isValid;
				if (inputIdentifier !== undefined && (value.length < rules.minLength))
				{	
					errorMessages.push("This field requires at least " + rules.minLength + " characters");
					reject(errorMessages);
				}
			}
			if (rules.maxLength) {
				isValid = (value.length <= rules.maxLength) && isValid;
				if (inputIdentifier !== undefined && (value.length > rules.maxLength))
				{	
					errorMessages.push("This field must not exceed " + rules.maxLength + " characters");
					reject(errorMessages);
				}
			}
			if (rules.regex) {
				isValid = RegExp(unescape(rules.regex), 'g').test(value) && isValid;
				if (inputIdentifier !== undefined && (RegExp(unescape(rules.regex), 'g').test(value) === false))
				{	
					errorMessages.push(rules.rule);
					reject(errorMessages);
				}
			}
			if(!rules.db && !rules.checkEmail) {
				resolve(isValid);
			}
			if (rules.checkEmail === true) {
				if (state.emails.includes(value) === false) {
					isValid = true && isValid;
					resolve(isValid);
				}
				else if (state.emails.includes(value) === true) {
					isValid = false;
					errorMessages.push("This e-mail adress is already being used");
					reject(errorMessages);
				}
			}
			if (rules.db === true) {
				if (state.users.includes(value) === false) {
					isValid = true && isValid;
					resolve(isValid);
				}
				else if (state.users.includes(value) === true) {
					errorMessages.push("Username already taken");
					reject(errorMessages);
				}
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = { ...this.state.orderForm };

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};

		updatedFormElement.value = event.target.value;
		
		// if (inputIdentifier !== "birthdate") {
			this.checkValidity(updatedFormElement.value, updatedFormElement.validation, inputIdentifier, this.state)
				.then((response) => {
					// console.log(response);
					updatedFormElement.valid = response;
					updatedFormElement.touched = true;
					updatedOrderForm[inputIdentifier] = updatedFormElement;

					let formIsValid = true;
					// eslint-disable-next-line no-unused-vars
					for (let inputIdentifier in updatedOrderForm) {
						formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
					}
					this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
				})
				.catch((e) => {
					updatedFormElement.valid = false;
					// console.log(e);
					updatedFormElement.touched = true;
					updatedFormElement.errorMessage = e;
					updatedOrderForm[inputIdentifier] = updatedFormElement;

					let formIsValid = true;
					// eslint-disable-next-line no-unused-vars
					for (let inputIdentifier in updatedOrderForm) {
						formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
					}
					this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
				})
		// }
		// else {
		// 	const ret = this.checkValidity2(updatedFormElement.value, updatedFormElement.validation);
		// 	if (typeof ret === "boolean") {
		// 		updatedFormElement.valid = ret;
		// 	}
		// 	else {
		// 		updatedFormElement.valid = false;
		// 		updatedFormElement.errorMessage = ret;
		// 	}
		// 	updatedFormElement.touched = true;
		// 	updatedOrderForm[inputIdentifier] = updatedFormElement;

		// 	let formIsValid = true;
		// 	// eslint-disable-next-line no-unused-vars
		// 	for (let inputIdentifier in updatedOrderForm) {
		// 		formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
		// 	}
		// 	this.setState({ orderForm2: updatedOrderForm, formIsValid: formIsValid });
		// }
	}

	render() {
		this.getEmails();
		// const { JWT } = this.context;
		return (
			<AccountDumb
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Account;
