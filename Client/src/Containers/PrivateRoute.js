// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react';
// eslint-disable-next-line no-unused-vars
import { Route, Redirect } from "react-router-dom"

import { UserContext } from '../Contexts/UserContext';

const PrivateRoute = ({component: Component, ...rest}) => {
	const { isLoggedIn } = useContext(UserContext);
	const { JWT } = useContext(UserContext);
	let _isMounted = false;
	
	if (JWT.token !== null && JWT.data.firstName) {
		_isMounted = true;
		let dateNow = new Date();
		// console.log(JWT.exp);
		// console.log(dateNow.getTime() / 1000);
		if (_isMounted && JWT.exp < (dateNow.getTime() / 1000)) {
			_isMounted = false;
			this.context.toggleUser(null);
		}
	}
	console.log("_isMounted: " + _isMounted);

	return (
		<Route 
			{...rest}
			render={props => {
				// console.log("isLoggedIn: " + isLoggedIn + " & Component is " + Component.name)
				if (isLoggedIn === true && Component.name !== "SignUp" && _isMounted) {
					return (<Component {...props} />) 
				}
				else if (isLoggedIn === true && Component.name === "SignUp" && _isMounted) {
					return (<Redirect to={{pathname: '/home', state:{from: props.location }}} />)
				}
				else if (isLoggedIn === false && Component.name === "SignUp") {
					_isMounted = false;
					return (<Component {...props} />)
				}
				else { 
					_isMounted = false;
					return (<Redirect to={{pathname: '/sign-up', state:{from: props.location }}} />)
				}
			}}
		/>
	)
}

export default PrivateRoute;
