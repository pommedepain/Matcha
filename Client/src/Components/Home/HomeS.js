import React, { Component } from 'react';

import classes from './Home.module.css';
import { UserContext } from '../../Contexts/UserContext';

class Home extends Component {
	static contextType = UserContext;

	render() {
		return (
			<div className={classes.main}>
				<h1 className={classes.h1}>Gallery of {this.context.JWT.data.username}</h1>
			</div>
		)
	}
}

export default Home;
