import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom"

import { UserContext } from '../Contexts/UserContext';

const PrivateRoute = ({component: Component, ...rest}) => {
	const { isLoggedIn } = useContext(UserContext);
	// console.log(isLoggedIn);

	return (
		<Route 
			{...rest}
			render={props => {
				if (isLoggedIn === true && Component.name !== "SignUp") {
					return (<Component {...props} />) 
				}
				else if (isLoggedIn === true && Component.name === "SignUp") {
					return (<Redirect to={{pathname: '/home', state:{from: props.location }}} />)
				}
				else if (isLoggedIn === false && Component.name === "SignUp") {
					return (<Component {...props} />)
				}
				else { 
					return (<Redirect to={{pathname: '/sign-up', state:{from: props.location }}} />)
				}
			}}
		/>
	)
}

export default PrivateRoute;
