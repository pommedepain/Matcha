import React from 'react'
import { Link } from 'react-router-dom'

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
				<Link to="/">
					<li className={classes.logo}>
						<h1>
							<i className="fas fa-puzzle-piece" /> Matcha
						</h1>
					</li>
				</Link>
				<Login />
			</div>
		)
	}
}

export default NavBar;
