import React, { Component } from 'react';

import SignUp from '../Components/Forms/SignUp/SignUpS';
import Home from '../Components/Home/HomeS';
import { UserContext } from '../Contexts/UserContext';

class Main extends Component {
	static contextType = UserContext;

	render() {
		const { isLoggedIn } = this.context;
		// console.log(isLoggedIn);

		return (
			isLoggedIn === true ?
			<Home />
			: <SignUp />
		)
	}
}

export default Main
