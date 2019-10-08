import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [JWT, setJWT] = useState(() => {
		const localData = localStorage.getItem('JWT');
		return (localData !== undefined ? JSON.parse(localData) : {data: {}, exp: 0, iat: 0, id: 1});
	});
	const [isLoggedIn, setLog] = useState(() => {
		const localLoggedIn = localStorage.getItem('JWT');
		return (localLoggedIn === undefined ? false : true);
	});
	const [logInPopup, setLogInPopup] = useState(false);

	const parseJwt = (token) => {
		let base64Url = token.split('.')[1];
		let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		
		return (JSON.parse(jsonPayload));
	};

	const toggleUser = (datas) => {
		let token = parseJwt(datas);
		setJWT({ data: token.data, exp: token.exp, iat: token.iat });
		setLog(!isLoggedIn);
	}

	const toggleLogInPopup = () => {
		setLogInPopup(!logInPopup);
	}

	useEffect(() => {
		localStorage.setItem('JWT', JSON.stringify(JWT))
	}, [JWT]);

	useEffect(() => {
		localStorage.setItem('isLoggedIn', isLoggedIn)
	}, [isLoggedIn]);

	return (
		<UserContext.Provider 
			value={{ 
				JWT, 
				isLoggedIn,
				toggleUser,
				logInPopup,
				toggleLogInPopup
			}} 
		>
			{props.children}
		</UserContext.Provider>
	);
}

export default UserContextProvider;
