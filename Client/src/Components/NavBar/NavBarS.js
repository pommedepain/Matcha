import React from 'react';
import io from 'socket.io-client';
import axios from 'axios';

import { UserContext } from '../../Contexts/UserContext';
import NavBarDummy from './NavBarD';

class NavBar extends React.Component {
	state = {
		errors: {},
		notifications: null,
		unreadNotifs: 0,
		displayNotifs: false,
		usersOnline: null
	}

	static contextType = UserContext;

	componentDidMount () {
		this.getNotifications();
	}

	getNotifications = () => {
		const { username, token } = this.context.JWT.data;

		if (username !== undefined) {
			axios.get(`http://localhost:4000/API/notifications/${username}`, {headers: {"x-auth-token": token}})
				.then(response => {
					// console.log(response.data.payload.result);
					this.setState({ notifications: response.data.payload.result}, function () {
						// console.log(this.state.notifications);
						let unreadNotifs = 0;
						for (let i = 0; i < this.state.notifications.length; i++) {
							if (this.state.notifications[i].read === false) {
								unreadNotifs += 1;
							}
						}
						console.log(unreadNotifs);
						if (unreadNotifs > 0) {
							this.setState({
								unreadNotifs: unreadNotifs
							});
						}
						if (this.context.newNotif.new) {
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
			const { username, token } = this.context.JWT.data;
			const mySocket = io('http://localhost:5000');
			this.context.toggleUser(null);
			mySocket.emit('logoutUser', username);
			axios.put(`http://localhost:4000/API/users/connect/${username}`, {headers: {"x-auth-token": token}})
			console.log("log out");
			resolve();
		}) 
	}
	logOut = () => {
		this.pre_log_out()
			.then(() => {
				document.location.reload(false);
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
		const { token } = this.context.JWT.data;
		let notifID = null;
		notifID = { id: this.state.notifications[index].id.low };

		axios.put('http://localhost:4000/API/notifications/read', notifID, {headers: {"x-auth-token": token}})
			.then((response) => {
				// console.log(response.data);
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
