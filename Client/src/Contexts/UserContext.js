import React, { createContext, useState, useEffect, Component } from 'react';

export const UserContext = createContext();

class UserContextProvider extends Component {
	state = {
		isLoggedIn: false,
		username: "",
		JWT: [],
		logInPopup: false
	}

	parseJwt = (token) => {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		
		console.log(JSON.parse(jsonPayload))
		return (JSON.parse(jsonPayload));
	};

	toggleUser = (newUsername, payload) => {
		let token = this.parseJwt(payload);
		this.setState({
			isLoggedIn: !this.state.isLoggedIn,
			username: newUsername, 
			JWT: token
		});
	}

	toggleLogInPopup = () => {
		this.setState({
			logInPopup: !this.state.logInPopup
		});
	}

	render() {
		return (
			<UserContext.Provider 
				value={{ 
					...this.state, 
					toggleUser: this.toggleUser, 
					toggleLogInPopup: this.toggleLogInPopup 
				}} 
			>
				{this.props.children}
			</UserContext.Provider>
		);
	}
}

// const UserContextProvider = (props) => {
// 	const [JWT, setJWT] = useState([]);
// 	const [isLoggedIn, setLog] = useState(false);
// 	const [logInPopup, setLogInPopup] = useState(false);

// 	const parseJwt = (token) => {
// 		let base64Url = token.split('.')[1];
// 		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
// 		let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
// 			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
// 		}).join(''));
		
// 		console.log(JSON.parse(jsonPayload))
// 		return (JSON.parse(jsonPayload));
// 	};

// 	const toggleUser = (newUsername, payload) => {
// 		let token = parseJwt(payload);
// 		this.setState({
// 			isLoggedIn: !this.state.isLoggedIn,
// 			username: newUsername, 
// 			JWT: token
// 		});
// 	}

// 	const toggleLogInPopup = () => {
// 		this.setState({
// 			logInPopup: !this.state.logInPopup
// 		});
// 	}

// 	return (
// 		<UserContext.Provider 
// 			value={{ 
// 				...this.state, 
// 				toggleUser: toggleUser, 
// 				toggleLogInPopup: toggleLogInPopup 
// 			}} 
// 		>
// 			{this.props.children}
// 		</UserContext.Provider>
// 	);
// }

export default UserContextProvider;
