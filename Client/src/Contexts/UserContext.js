import React, { createContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import Axios from 'axios';

export const UserContext = createContext();

/** 
 *	README
 *	To create a new context element:
 *		- add a 'const/let variable_name = useState(true/false | () => { function to 
 *		choose how to in initialize variable on refresh depending on what stored in 
 *		localStorage.getItem('variable_name') });'
 *		- either creates a function that will be called to set its value, or choose 
 *		another varible that its value's changes are depending on.
 **/

const UserContextProvider = (props) => {

	const [JWT, setJWT] = useState(() => {
		const localData = localStorage.getItem('JWT');
		let token = {"token": localData};
		token = JSON.parse(localData);
		// console.log(token)
		if (token !== null && token.data.firstName) {
			let dateNow = new Date();
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
			// token.data.firstName ? console.log("isLoggedIn initialized true"): console.log("isLoggedIn initialized false");
			return (token.data.firstName ? true : false);
		}
		else {
			return (false);
		}
	});

	const [logInPopup, setLogInPopup] = useState(false);

	const [socket, setSocket] = useState(() => {
		const localDatas = localStorage.getItem('socket');
		// let token = {"token": localDatas};
		// console.log(token);
		return (localDatas);
	});

	const [newNotif, setnewNotif] = useState(() => {
		const localDatas = localStorage.getItem('newNotif');
		const token = JSON.parse(localDatas);
		console.log("token:");
		console.log(token);
		if (token !== null && token.localDatas) {
			console.log("localStorage detected:");
			console.log(localDatas)
			return (token);
		}
		else {
			console.log("nothing retrieved from localStorage:");
			console.log(localDatas);
			return ({});
		}
	});

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

	const toggleNotifReceived = (oldNotif) => {
		console.log(oldNotif)
		oldNotif["new"] = false;
		// let notifReceived = {
		// 	emitter: oldNotif.emitter,
		// 	receiver: JWT.username,
		// 	type: oldNotif.type,
		// 	new: false
		// };
		setnewNotif(oldNotif);
	}

	useEffect(() => {
		const mySocket = io('http://localhost:5000');
		localStorage.setItem('JWT', JSON.stringify(JWT));
		if (JWT.data.firstName) {
			mySocket.emit("loginUser", JWT.data.username);
			setSocket(mySocket);
			setLog(true);
			mySocket.on('notification', notification => {
				/* Beg of trying to keep notifs in localStorage */
				// console.log("new notif:");
				// console.log(notification);
				// console.log("current state of newNotif:");
				// console.log(newNotif);
				// newNotif[Date.now()] = {
				// 	"emitter": notification.data.emitter,
				// 	"action": notification.data.type
				// };
				// console.log("setNotification of:");
				// console.log(newNotif);
				// setnewNotif(newNotif);
				// console.log("after setNotification:")
				// console.log(newNotif);

				let newNotification = {
					emitter: notification.data.emitter,
					receiver: JWT.data.username,
					type: notification.data.type,
					new: true
				}
				console.log(newNotification);

				setnewNotif(newNotification);


				Axios.post('http://localhost:4000/API/notifications/create', newNotification)
					.then((response) => {
						if (response.data.payload.result === "Missing information") {
							console.log(response.data.payload.result);
						}
						else {
							console.log("sent to db successfully");
						}
					})
					.catch((err) => {
						console.log(err);
					})
			});
		}
		else {
			// console.log("setSocket(null) && setLog to false");
			setLog(false);
			setSocket(null);
		}
	}, [JWT]);

	useEffect(() => {
		localStorage.setItem('isLoggedIn', isLoggedIn)
	}, [isLoggedIn]);

	useEffect(() => {
		let cache = [];
		localStorage.setItem('socket', JSON.stringify(socket, function(key, value) {
			if (typeof value === 'object' && value !== null) {
				if (cache.indexOf(value) !== -1) {
					/* Duplicate reference found, discard key */
					return;
				}
				/* Store value in our collection */
				cache.push(value);
			}
			return value;
		}));
		/* Enable garbage collection */
		cache = null;
	}, [socket]);

	useEffect(() => {
		console.log("change recorded in newNotif:");
		console.log(newNotif);
		localStorage.setItem('newNotif', JSON.stringify(newNotif) )
	}, [newNotif]);

	return (
		<UserContext.Provider 
			value={{ 
				JWT, 
				isLoggedIn,
				newNotif,
				socket,
				toggleUser,
				logInPopup,
				toggleLogInPopup,
				toggleNotifReceived
			}} 
		>
			{props.children}
		</UserContext.Provider>
	);
}

export default UserContextProvider;
