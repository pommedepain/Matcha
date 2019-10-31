import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';

export const SocketContext = createContext();

const SocketContextProvider = (props) => {
	const mySocket = io('http://localhost:5000');

	const [socket, setSocket] = useState(null);

	const toggleUser = (datas) => {
		let token = parseJwt(datas);
		// console.log(token);
		setJWT({ data: token.data, exp: token.exp, iat: token.iat, token: datas });
		if (token === undefined) {
			setLog(false);
			setSocket(null);
		}
		else {
			setSocket(mySocket);
			setLog(true);
		}
	}

	useEffect(() => {
		// console.log(JWT);
		const mySocket = io('http://localhost:5000');
		localStorage.setItem('JWT', JSON.stringify(JWT))
		if (JWT.data.firstName) {
			mySocket.emit("loginUser", JWT.data.username);
			setSocket(mySocket);
			setLog(true);
		}
		else {
			setLog(false);
		}
	}, [JWT]);

	useEffect(() => {
		localStorage.setItem('socket', socket)
	}, [socket]);

	return (
		<SocketContext.Provider 
			value={{ 
				JWT, 
				isLoggedIn,
				toggleUser,
				logInPopup,
				toggleLogInPopup
			}} 
		>
			{props.children}
		</SocketContext.Provider>
	);
}

export default SocketContextProvider;
