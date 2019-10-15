import React, { useContext } from 'react';
import { Route, Redirect } from "react-router-dom"

import { UserContext } from '../Contexts/UserContext';

const PrivateRoute = ({component: Component, ...rest}) => {
	const { isLoggedIn } = useContext(UserContext);

	return (
		<Route 
			{...rest}
			render={props =>
				isLoggedIn === true ? 
				(<Component {...props} />) : 
				(<Redirect to={{pathname: '/sign-up', state:{from: props.location }}} />)
			}
		/>
	)
}

export default PrivateRoute;
