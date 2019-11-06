import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import { UserContext } from '../../Contexts/UserContext';
import NavBarDummy from './NavBarD';

class NavBar extends React.Component {
	state = {
		errors: {},
		notifications: [],
		unreadNotifs: 0,
		displayNotifs: false,
		usersOnline: null
	}

	static contextType = UserContext;

	componentDidMount () {
		this.getNotifications();
	}

	getNotifications = () => {
    	const { username } = this.context.JWT.data;
		const { token } = this.context.JWT;

		if (username !== undefined) {
			// console.log(username)
			axios.get(`http://localhost:4000/API/notifications/${username}`, {headers: {"x-auth-token": token}})
				.then(response => {
					console.log(response.data.payload.result);
					let notificationsParsed = [];
					let j = 0;
					/* Save notifications except the 'unlike' ones */
					response.data.payload.result.map(elem => {
						if (elem.type === 'unlike') {
							return null;
						}
						if (elem.type === 'unmatch') {
							return (notificationsParsed[j++] = elem);
						}
						else {
							return (notificationsParsed[j++] = elem);
						}
					})
					console.log(notificationsParsed);
					this.setState({ notifications: notificationsParsed}, function () {
						// console.log(this.state.notifications);
						let unreadNotifs = 0;
						for (let i = 0; i < this.state.notifications.length; i++) {
							if (this.state.notifications[i].read === false) {
								unreadNotifs += 1;
							}
						}
						// console.log(unreadNotifs);
						if (unreadNotifs > 0) {
							this.setState({
								unreadNotifs: unreadNotifs
							}, function() { console.log(this.state.unreadNotifs)});
						}
						if (this.context.newNotif.new) {
							// console.log(this.context.newNotif);
							this.context.toggleNotifReceived(this.context.newNotif);
						}
					});
				})
				.catch(err => { 
					console.log(err);
				})
		}
	}

	pre_log_out = () => {
		return new Promise((resolve) => {
      const { username } = this.context.JWT.data;
			const mySocket = io('http://localhost:5000');
			this.context.toggleUser(null);
			mySocket.emit('logoutUser', username);
			console.log("log out");
			resolve(this.context.JWT);
		}) 
	}

	logOut = () => {
    	const { username } = this.context.JWT.data;
    	const { token } = this.context.JWT;
    	axios.put(`http://localhost:4000/API/users/connect/${username}`, null, {headers: {"x-auth-token": token}})
    	  .then(() => this.pre_log_out())
				.then((res) => {
					console.log(res);
					// document.location.reload(false);
				})
				.catch((err) => {
					console.log(err);
				})
	}

	showNotifs = (e) => {
		e.preventDefault();
		this.setState({ displayNotifs: !this.state.displayNotifs });
	}

	handleNotifClick = (e, index) => {
		e.preventDefault();
    	const { token } = this.context.JWT;
		let notifID = null;
		notifID = { id: this.state.notifications[index].id.low };

		console.log(this.state.notifications[index]);
		axios.put('http://localhost:4000/API/notifications/read', notifID, {headers: {"x-auth-token": token}})
			.then((response) => {
				if (response.data.payload.result === "notification has been read") {
					const notifications = this.state.notifications;
					notifications[index].read = true;
					this.setState({ 
						notifications: notifications,
						unreadNotifs: this.state.unreadNotifs - 1
					});
				}
			})
			.catch((err) => {
				console.log(err);
			})
	}
	
	render() {
		if (this.context.newNotif.new === true) {
			console.log("new notif in localStorage detected");
			this.getNotifications();
		}
		return (
			<NavBarDummy
				logOut={this.logOut.bind(this)}
				showNotifs={this.showNotifs.bind(this)}
				handleNotifClick={this.handleNotifClick.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default NavBar;
