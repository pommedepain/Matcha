import React, { Component } from 'react';

import ResetPasswordDummy from './ResetPasswordD';
import { UserContext } from '../../../Contexts/UserContext';

const axios = require('axios');
const datas = require('../../../Datas/resetForm.json');

class ResetPasswordSmart extends Component {
	state = {
		orderForm: datas.orderForm,
		hiddenFirst: true,
		hiddenSecond: true,
		formIsValid: false,
		alertDesign: null,
		loading: false
	};

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

	toggleShow = (event, inputIdentifier) => {
		event.preventDefault()
		console.log(inputIdentifier)
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
		if (inputIdentifier === "password") {
			this.setState({ 
				hiddenFirst: !this.state.hiddenFirst,
				orderForm: updatedOrderForm
			});
		}
		else {
			this.setState({ 
				hiddenSecond: !this.state.hiddenSecond,
				orderForm: updatedOrderForm
			});
		}
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
		console.loh(formDatas);

		// axios.put(`http://localhost:4000/API/update/${}`, formDatas, {headers: {"x-auth-token": }})
		// 	.then(res => {
		// 		console.log(res);
		// 		this.setState({ 
		// 			loading: false,
		// 			formIsValid: true
		// 		});
		// 		if (res.data.success) {
		// 			this.context.toggleUser(res.data.payload);
		// 			this.setState({
		// 				alertDesign: null
		// 			});
		// 		}
		// 	})
		// 	.catch(error => {
		// 		this.setState({ 
		// 			loading: false,
		// 			formIsValid: true,
		// 			alertDesign: {
		// 				message: "Error.",
		// 				button:"Try Again",
		// 				color: "red"
		// 			}
		// 		});
		// 		console.log(error);
		// 	})
	}

	render () {
		return (
			<ResetPasswordDummy
				toggleShow={this.toggleShow.bind(this)}
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				submit={this.submit.bind(this)}
				{...this.context}
				{...this.state}
			/>
		)
	}
}

export default ResetPasswordSmart;
