import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const UserContext = createContext();

const UserContextProvider = (props) => {

	const [JWT, setJWT] = useState(() => {
		const localData = localStorage.getItem('JWT');
		let token = {"token": localData};
		token = JSON.parse(localData);
		// console.log(token)
		if (token !== null && token.data.firstName) {
			let dateNow = new Date();
			// console.log(dateNow.getTime() / 1000);
			// console.log(token.exp);
			if (token.exp < (dateNow.getTime() / 1000)) {
				return ({data: {}, exp: 0, iat: 0, token: "" })
			}
			else {
				return (token);
			}
		}
		else {
			return ({data: {}, exp: 0, iat: 0, token: "" });
		}
	});

	const [isLoggedIn, setLog] = useState(() => {
		const localDatas = localStorage.getItem('JWT');
		const token = JSON.parse(localDatas);
		// console.log(token);
		if (token !== null) {
			token.data.firstName ? console.log("isLoggedIn initialized true"): console.log("isLoggedIn initialized false");
			return (token.data.firstName ? true : false);
		}
		else {
			return (false);
		}
	});

	const [logInPopup, setLogInPopup] = useState(false);

	const [socket, setSocket] = useState(null);

	const parseJwt = (token) => {
		if (token !== null) {
			let base64Url = token.split('.')[1];
			let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
			let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
				return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
			}).join(''));
			return (JSON.parse(jsonPayload));
		}
		else {
			return ({data: {}, exp: 0, iat: 0, token: "" });
		}
	};

	const toggleUser = (datas) => {
		let token = parseJwt(datas);
		setJWT({ data: token.data, exp: token.exp, iat: token.iat, token: datas });
	}

	const toggleLogInPopup = () => {
		setLogInPopup(!logInPopup);
	}

	useEffect(() => {
		const mySocket = io('http://localhost:5000');
		localStorage.setItem('JWT', JSON.stringify(JWT))
		console.log(JWT.data.firstName);
		if (JWT.data.firstName) {
			console.log("setSocket(mySocket) && setLog to true");
			mySocket.emit("loginUser", JWT.data.username);
			setSocket(mySocket);
			setLog(true);
		}
		else {
			console.log("setSocket(null) && setLog to false");
			setLog(false);
			setSocket(null);
		}
	}, [JWT]);

	useEffect(() => {
		localStorage.setItem('isLoggedIn', isLoggedIn)
	}, [isLoggedIn]);

	useEffect(() => {
		localStorage.setItem('socket', socket)
	}, [socket]);

	return (
		<UserContext.Provider 
			value={{ 
				JWT, 
				isLoggedIn,
				// socket,
				toggleUser,
				logInPopup,
				toggleLogInPopup,
			}} 
		>
			{props.children}
		</UserContext.Provider>
	);
}

export default UserContextProvider;
