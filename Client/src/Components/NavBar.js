import React from 'react'

import classes from './NavBar.module.css'
import Login from './Forms/LogIn/LoginS'

class NavBar extends React.Component {
	state = {
		errors: {}
	}

	handleChange = (event) => {
		const {name, value} = event.target
		this.setState({[name]: value})
	}
	
	render() {
		return (
			<div className={classes.NavBar}>
				<a href="/"><h1 className={classes.logo}><i className="fas fa-puzzle-piece" /> Matcha</h1></a>
				<Login />
			</div>
		)
	}
}

export default NavBar;
