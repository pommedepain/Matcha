import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import classes from './NavBar.module.css';
import Login from '../Forms/LogIn/LoginS';
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

	showNotifs = (e) => {
		e.preventDefault();
		console.log("showNotifs triggered.");
	}
	
	render() {
		const { JWT, isLoggedIn } = this.context;

		return (
			<div className={classes.conteneur}>
				<div className={classes.NavBar}>
					<Link to="/home">
						<li className={classes.logo}>
							<h1>Matcha
								{/* <i className="fas fa-puzzle-piece" /> Matcha */}
							</h1>
						</li>
					</Link>
					{isLoggedIn === false ?
						<Login />
						:
						[<div key={1} className={classes.wrapper}>
							<h4 className={classes.username}>Welcome back {JWT.data.username} !</h4>
							<div className={classes.buttons}>
								<Link 
									to="/account" 
									className={cx(classes.sidebarLogged, "btn-sm")}
								>Account</Link>
								<button 
									className={cx(classes.sidebarLogged, "btn-sm")}
									onClick={this.logOut.bind(this)}
									href="/"
								>Log Out</button>
							</div>
						</div>]
					}
				</div>
				{isLoggedIn === true ?
				<div className={classes.options}>
					<div className={classes.left}>
						<Link
							to="/profil"
							className={classes.profil}
						><i className="fas fa-user-circle"></i> Profil</Link>
						<Link
							to="/matches"
							className={classes.matches}
						><i className="fas fa-bolt"></i> Matches</Link>
						<Link
							to="/messages"
							className={classes.messages}
						><i className="far fa-envelope"></i> Messages</Link>
						<Link
							to="/search"
							className={classes.search}
						><i className="fab fa-searchengin"></i> Search</Link>
					</div>
					<div className={classes.right}>
						<button
							className={classes.notifs}
							onClick={this.showNotifs.bind(this)}
						><i className="far fa-bell"></i></button>
					</div>
				</div>
				: null}
			</div>
		)
	}
}

export default NavBar;
