import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserContextProvider = (props) => {
	const [JWT, setJWT] = useState(() => {
		const localData = localStorage.getItem('JWT');
		const token = JSON.parse(localData);
		if (token.data.firstName) {
			let dateNow = new Date();
			// console.log(dateNow.getTime() / 1000);
			// console.log(token.exp);
			const isLogged = localStorage.getItem('isLoggedIn');
			console.log(isLogged);
			if (token.exp < (dateNow.getTime() / 1000)) {
				return ({data: {}, exp: 0, iat: 0 })
			}
			else {
				return (token);
			}
		}
		else {
			return ({data: {}, exp: 0, iat: 0 });
		}
	});

	const [isLoggedIn, setLog] = useState(() => {
		const localDatas = localStorage.getItem('JWT');
		const token = JSON.parse(localDatas);
		// console.log(token.data);
		return (token.data.firstName ? true : false);
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
		// console.log(token);
		if (token === undefined) {
			setLog(false);
		}
		else {
			setLog(true);
		}
	}

	const toggleLogInPopup = () => {
		setLogInPopup(!logInPopup);
	}

	useEffect(() => {
		localStorage.setItem('JWT', JSON.stringify(JWT))
		if (JWT.data.firstName) {
			setLog(true);
		}
		else {
			setLog(false);
		}
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
