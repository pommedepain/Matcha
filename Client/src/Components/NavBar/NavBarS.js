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
		displayNotifs: false
	}

	static contextType = UserContext;

	componentDidMount () {
		this.getNotifications();
	}

	getNotifications = () => {
		const { username } = this.context.JWT.data;

		if (username !== undefined) {
			axios.get(`http://localhost:4000/API/notifications/${username}`)
				.then(response => {
					// console.log(response.data.payload.result);
					this.setState({ notifications: response.data.payload.result}, function () {
						console.log(this.state.notifications);
						let unreadNotifs = 0;
						for (let i = 0; i < this.state.notifications.length; i++) {
							if (this.state.notifications[i].read === false) {
								unreadNotifs += 1;
							}
						}
						if (unreadNotifs > 0) {
							console.log(unreadNotifs + " notifications unread");
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

	// handleChange = (event) => {
	// 	const {name, value} = event.target
	// 	this.setState({[name]: value})
	// }

	pre_log_out = () => {
		return new Promise((resolve) => {
			const mySocket = io('http://localhost:5000');
			this.context.toggleUser(null);
			mySocket.emit('logoutUser', this.context.JWT.data.username);
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
		console.log("showNotifs triggered.");
		this.setState({ displayNotifs: !this.state.displayNotifs }, function () {
			if (this.state.displayNotifs === true) {
				console.log(this.state.notifications);
			}
		});
	}

	handleNotifClick = (e, index) => {
		e.preventDefault();
		console.log(e.target);
		console.log("notif clicked: " + index);
		let notifID = null;
		notifID = { id: this.state.notifications[index].id.low };
		console.log(notifID);

		axios.put('http://localhost:4000/API/notifications/read', notifID)
			.then((response) => {
				console.log(response.data);
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

	componentDidUpdate () {
		if (this.context.newNotif.new === true) {
			this.getNotifications();
		}
	}
	
	render() {
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
