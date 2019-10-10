import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import classes from './NavBar.module.css';
import Login from '../Forms/LogIn/LoginS';
// import Account from '../Forms/Account/AccountS';
import { UserContext } from '../../Contexts/UserContext';

class NavBar extends React.Component {
	state = {
		errors: {}
	}

	static contextType = UserContext;

	handleChange = (event) => {
		const {name, value} = event.target
		this.setState({[name]: value})
	}

	logOut = () => {
		this.context.toggleUser(null);
	}
	
	render() {
		const { JWT, isLoggedIn } = this.context;

		return (
			<div className={classes.NavBar}>
				<Link to="/home">
					<li className={classes.logo}>
						<h1>
							<i className="fas fa-puzzle-piece" /> Matcha
						</h1>
					</li>
				</Link>
				{isLoggedIn === false ?
					<Login />
					:
					[<div key={1}>
						<h4 className={classes.username}>Welcome back {JWT.data.username} !</h4>
						<div className={classes.buttons}>
							<Link 
								to="/account" 
								className={cx(classes.sidebarLogged, "btn-sm")}
							>Account</Link>
							<button 
								className={cx(classes.sidebarLogged, "btn-sm")}
								onClick={this.logOut.bind(this)}
							>Log Out</button>
						</div>
					</div>]
				}
			</div>
		)
	}
}

export default NavBar;
