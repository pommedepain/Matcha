import React, { Component } from 'react'
import cx from 'classnames'

import classes from './Login.module.css'
const axios = require('axios');

class Login extends Component {
	state = {
		style: '',
		showPopup: false,
		hidden: true,
		user: false,
		username: "pomme",
		password: "philou",
		loading: false
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
		this.setState({ hidden: !this.state.hidden })
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
		return (
			<div className={classes.log}>
				{
					!this.state.user ?
					[<div key={1}>
						<button className={cx(classes.sidebar, "btn-sm")} onClick={this.togglePopup.bind(this)}>Log In</button>
						<LogIn
							popup={this.togglePopup.bind(this)}
							handleChange={this.handleChange.bind(this)}
							submit={this.submit.bind(this)}
							toggleShow={this.toggleShow.bind(this)}
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
