import React from 'react'

import classes from './NavBar.module.css'
import LogIn from './Forms/LogIn'

const axios = require('axios');

class NavBar extends React.Component {
	state = {
		style: '',
		showPopup: false,
		hidden: true,
		user: false,
		username: "",
		password: ""
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
		const data = this.state
		let token = null

		axios.post('http://localhost:4000/API/auth', {
			username: data.username,
			password: data.password
        })
        .then((response) => {
			console.log(response.data)
			response.data.success ? 
			token = response.data.payload
			: token = null;
        	return (response.data.payload);
        })
        .catch(error => {
			console.log(error)
          return (false);
        })
	}
	
	render() {
		return (
			<div className={classes.NavBar}>
				<h1 className={classes.logo}><i className="fas fa-puzzle-piece" /> Matcha</h1>
				<div className={classes.log}>
				{
					!this.state.user ?
					[<div key={1}>
						<button className={classes.sidebar} onClick={this.togglePopup.bind(this)}>Log In</button>
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
			</div>
		)
	}
}

export default NavBar;
