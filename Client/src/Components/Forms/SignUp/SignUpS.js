import React, { Component } from 'react';

import Form from './SignUpD';
import classes from './SignUp.module.css';

const axios = require('axios');
const TagDatas = require('../../../Datas/tagSuggestions.json');
const formDatas = require('../../../Datas/signUpForm.json');

class SignUp extends Component {
	state = {
		showPopup: false,
		showAlert: false,
		style: {},
		loading: false,
		formIsValid: false,
		orderForm1: formDatas.orderForm1,
		orderForm2: formDatas.orderForm2,
		range: [18, 25],
		localisation: 5,
		tags: [
			{ id: "athlete", text: "Athlete" },
			{ id: "geek", text: "Geek" }
		],
		password: formDatas.password,
		cPasswd: formDatas.cPasswd
	}

	updateErrorMessage = (inputIdentifier, newMessage) => {
		let updatedOrderForm = {};
		console.log(inputIdentifier);

		if (inputIdentifier !== "password") {
			const trueOrderForm = (inputIdentifier === "birthdate" || inputIdentifier === "gender" || inputIdentifier === "sexualOrient" || inputIdentifier === "bio" ? "orderForm2" : "orderForm1");

			updatedOrderForm = (trueOrderForm === "orderForm2" ?
			{ ...this.state.orderForm2 }
			: { ...this.state.orderForm1 });

			const updatedFormElement = {
				...updatedOrderForm[inputIdentifier]
			};
			updatedFormElement.errorMessage = newMessage;
			updatedOrderForm[inputIdentifier] = updatedFormElement;
			console.log(updatedOrderForm);
			trueOrderForm === "orderForm1" ?
			this.setState({ orderForm1: updatedOrderForm }) :
			this.setState({ orderForm2: updatedOrderForm });
		}
		else {
			updatedOrderForm = {...this.state.password};
			updatedOrderForm.errorMessage = newMessage;
			console.log(updatedOrderForm);
			// this.setState({ password: updatedOrderForm });
		}
	}

	checkUsername = (username) => {
		return new Promise (function (resolve, reject) {
			axios.get(`http://localhost:4000/API/users/`)
				.then(response => {
					if (response.data.payload.users.indexOf(username) === -1) {
						console.log("username available")
						resolve(true);
					}
					else {
						reject(new Error("Username already exists"));
					}
				})
				.catch(err => { 
					console.log(err);
				})
		})
	}

	checkValidity(value, rules, checkUsername, inputIdentifier, updateErrorMessage) {
		return new Promise (function (resolve, reject) {
			let isValid = true;

			if (!rules) {
				resolve(true);
			}
			if (rules.required) {
				isValid = (value.trim() !== "") && isValid;
				if (inputIdentifier !== undefined && value.trim() === "")
					updateErrorMessage(inputIdentifier, "hola");
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
			if(!rules.db) {
				resolve(isValid);
			}
			if (rules.db) {
				console.log(isValid);
				checkUsername(value)
				.then((response) => {
					isValid = response && isValid;
					resolve(isValid);
				})
				.catch((e) => {
					// console.log(e);
					reject(e);
				});
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		let updatedOrderForm = {};
		const trueOrderForm = inputIdentifier === "birthdate" || inputIdentifier === "gender" || inputIdentifier === "sexualOrient" || inputIdentifier === "bio" ? "orderForm2" : "orderForm1";

		updatedOrderForm = (trueOrderForm === "orderForm2" ?
		{ ...this.state.orderForm2 }
		: { ...this.state.orderForm1 });

		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		updatedFormElement.value = event.target.value;
		this.checkValidity(updatedFormElement.value, updatedFormElement.validation, this.checkUsername, inputIdentifier, this.updateErrorMessage)
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
				trueOrderForm === "orderForm2" ?
				this.setState({ orderForm2: updatedOrderForm, formIsValid: formIsValid })
				: this.setState({ orderForm1: updatedOrderForm, formIsValid: formIsValid });
			})
			.catch((e) => {
				updatedFormElement.valid = false;
				console.log(e.message);
				updatedFormElement.touched = true;
				updatedOrderForm[inputIdentifier] = updatedFormElement;

				let formIsValid = true;
				// eslint-disable-next-line no-unused-vars
				for (let inputIdentifier in updatedOrderForm) {
					formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
				}
				trueOrderForm === "orderForm2" ?
				this.setState({ orderForm2: updatedOrderForm, formIsValid: formIsValid })
				: this.setState({ orderForm1: updatedOrderForm, formIsValid: formIsValid });
			})
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

	handleChange = (event) => {
		const target = event.target;
		if (event.type === 'click')
		{
			event.preventDefault();
			this.setState({showAlert: !this.state.showAlert})
		}
		else
		{
			const value = target.type === 'checkbox' ? target.checked : target.value;
			const name = target.name;
			this.setState({[name]: value})
		}
	}

	handleSlider = (newValue) => {
		this.setState(
			{localisation: newValue}
		)
	}

	handleRange = (newValue) => {
		this.setState(
			{range: newValue}
		)
	}

	passwordStrength = (event) => {
		const name = event.target.name;
		var zxcvbn = require('zxcvbn');
		event.preventDefault();
		let value = zxcvbn(event.target.value);
		const updatedElem = {
			...this.state[name]
		};
		updatedElem.value = event.target.value;
		if (name === "password") {
			// console.log(updatedElem.value);
			// console.log(updatedElem.validation);
			updatedElem.valid = this.checkValidity(updatedElem.value, updatedElem.validation, this.checkUsername, name, this.updateErrorMessage);
			this.checkValidity(updatedElem.value, updatedElem.validation, this.checkUsername)
			.then((response) => {
				// console.log(response);
				updatedElem.valid = response;
				updatedElem.touched = true;
				updatedElem.value === "" ?
				updatedElem.score = null
				:
				updatedElem.score = value.score;
				this.setState({ [name]: updatedElem });
			})
			.catch((e) => {
				console.log(e);
				updatedElem.valid = false;
				updatedElem.touched = true;
				updatedElem.value === "" ?
				updatedElem.score = null
				:
				updatedElem.score = value.score;
				this.setState({ [name]: updatedElem });
			})
		}
		else if (name === "cPasswd") {
			if (event.target.value === this.state.password.value)
				updatedElem.valid = true;
			else
				updatedElem.valid = false;
		}
		updatedElem.touched = true;
		event.target.value === "" ?
		updatedElem.score = null
		:
		updatedElem.score = value.score;
		// console.log(updatedElem);
		this.setState({ [name]: updatedElem });
	}

	handleDelete = (i) => {
		const { tags } = this.state
		this.setState({
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				console.log(tag)
				return (this.setState(
					state => ({ tags: [...state.tags, tag] })
				))
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
	}

	nextStep = (props) => {
		let current_fs, next_fs; //fieldsets
		let progressBar;

		current_fs = props.target.parentElement;
		next_fs = current_fs.nextElementSibling;
		progressBar = current_fs.parentElement.childNodes[1].childNodes;
		
		// activate next step on progressbar
		for (let i = 0; i < progressBar.length; i++)
			if (progressBar[i].className.search(/active/i) === -1)
			{
				progressBar[i].classList.add(classes.active)
				break;
			}

		//show the next fieldset
		next_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	}


	previousStep = (props) => {
		let current_fs, previous_fs;
		let progressBar;

		current_fs = props.target.parentElement;
		previous_fs = current_fs.previousElementSibling;
		progressBar = current_fs.parentElement.childNodes[1].childNodes;

		for (let i = (progressBar.length - 1); i > 0; i--)
			if (progressBar[i].className.search(/active/i) !== -1)
			{
				progressBar[i].classList.remove(classes.active)
				break;
			}

		//show the previous fieldset
		previous_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	}

	submit = (event) => {
		event.preventDefault();
		this.setState({ loading: true });
		const formDatas = {
			password: this.state.password,
			ageMin: this.state.range[0],
			ageMax: this.state.range[1],
			localisation: this.state.localisation,
            tags: this.state.tags
		};
		// eslint-disable-next-line no-unused-vars
		for (let formElementIdentifier in this.state.orderForm1) {
			formDatas[formElementIdentifier] = this.state.orderForm1[formElementIdentifier].value;
		}
		// eslint-disable-next-line no-unused-vars
		for (let formElementIdentifier in this.state.orderForm2) {
			formDatas[formElementIdentifier] = this.state.orderForm2[formElementIdentifier].value;
		}
		console.log(formDatas);

		axios
			.post('http://localhost:4000/API/users', formDatas)
			.then(response => {
				this.setState({ loading: false })
				console.log(response.data.succes)
				return (response.data);
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
		return (
			<Form 
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				popup={this.togglePopup.bind(this)}
				handleChange={this.handleChange.bind(this)}
				passwordStrength={this.passwordStrength.bind(this)}
				nextStep={this.nextStep.bind(this)}
				previousStep={this.previousStep.bind(this)}
				handleRange={this.handleRange.bind(this)}
				handleSlider={this.handleSlider.bind(this)}
				handleAddition={this.handleAddition.bind(this)}
				handleDelete={this.handleDelete.bind(this)}
				submit={this.submit.bind(this)}
				{...this.state}
			/>
		);
	}
}

export default SignUp;
