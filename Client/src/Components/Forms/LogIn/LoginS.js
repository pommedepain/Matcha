import React, { Component } from 'react'
import cx from 'classnames'

import classes from './LogIn.module.css';
import LoginDumb from './LogInD'
const axios = require('axios');

class Login extends Component {
	state = {
		orderForm: {
			username: {
				elementType: 'input',
				elementConfig: {
					type: 'text',
					placeholder: "Your username"
				},
				value: ""
			},
			password: {
				elementType: 'input',
				elementConfig: {
					type: "password",
					placeholder: "Your password"
				},
				value: ""
			}
		},
		style: '',
		showPopup: false,
		hidden: true,
		user: false, 
		loading: false
	}

	initializeState = () => {
		this.setState({
			password: {
				elementType: 'input',
				elementConfig: {
					type: this.hidden ? "password" : "text",
					placeholder: "Your password"
				},
				value: ""
			}
		})
	}

	// initInput = (element, type, placeholder, value) => {
	// 	let arrayElem = {
	// 		elementType: element,
	// 		elementConfig: {
	// 			type: type,
	// 			placeholder: placeholder
	// 		},
	// 		value: value
	// 	};
	// 	return (arrayElem);
	// }

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.orderForm
		};
		const updatedFormElement = {
			...updatedOrderForm[inputIdentifier]
		};
		updatedFormElement.value = event.target.value;
		updatedOrderForm[inputIdentifier] = updatedFormElement;
		this.setState({ orderForm: updatedOrderForm });
	}

	handleChange = (event) => {
		const {name, value} = event.target
		this.setState({[name]: value})
	}

	togglePopup = () => {
		if (this.state.showPopup)
		{
			this.setState({
				showPopup: !this.state.showPopup
			})
			document.getElementById("display_page").style.filter = ''
		}
		else
		{
			this.setState({
				showPopup: !this.state.showPopup
			})
			document.getElementById("display_page").style.filter = 'blur(3px)'
		}
	}

	toggleShow = (event) => {
		event.preventDefault()
		console.log(this.state.orderForm.password.elementConfig.type)
		const newType = this.state.orderForm.password.elementConfig.type === 'password' ? 'text' : 'password';
		const changeState = new Promise((resolve, reject) => {
			resolve(this.setState({ 
				hidden: !this.state.hidden,
				orderForm: {
					password: {
						elementConfig: {
							type: newType
						}
					}
				}
			}))

			reject(console.log("ERREUR"))
		});
			
		changeState
			.then(ret => console.log(ret))
			.catch(err => console.log(err))
	}

	submit = (event) => {
		console.log(this.state)
		event.preventDefault()
		this.setState({
			loading: true
		})
		const datas = {
			username: this.state.username,
			password: this.state.password
		}

		axios
			.post('http://localhost:4000/API/auth', datas)
			.then(response => {
				let token = null
				this.setState({ loading: false })
				console.log(response.datas)
				response.datas.success ? 
				token = response.datas.payload
				: token = null;
				console.log(token)
				return (token);
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
		this.initializeState.bind(this);
		return (
			<div className={classes.log}>
				{
					!this.state.user ?
					[<div key={1}>
						<button className={cx(classes.sidebar, "btn-sm")} onClick={this.togglePopup.bind(this)}>Log In</button>
						<LoginDumb
							popup={this.togglePopup.bind(this)}
							handleChange={this.handleChange.bind(this)}
							submit={this.submit.bind(this)}
							toggleShow={this.toggleShow.bind(this)}
							inputChangedHandler={this.inputChangedHandler.bind(this)}
							{...this.state}
						/>
					</div>]
					:
					[<div key={2}>
						<button className={classes.sidebar}>Account</button>
						<button className={classes.sidebar}>Log Out</button>
					</div>]
				}
			</div>
		)
	}
}

export default Login;
