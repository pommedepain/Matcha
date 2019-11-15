import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import MatchesDummy from './MatchesD';
import { UserContext } from '../../Contexts/UserContext';

const _ = require('lodash');

class MatchesSmart extends Component {
	state = {
		matchesList: [],
		visitsHistoric: [],
		usersOnline: []
	};

	static contextType = UserContext;

	componentDidMount() {
		this.getMatches();
		this.getVisits();
		this.getUsersOnline();
	}

	getMatches = () => {
		axios.get(`http://localhost:4000/API/users/matches/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.matchesSort(res.data.payload.result);
			})
			.catch((err) => console.log(err))
	}

	getVisits = () => {
		axios.get(`http://localhost:4000/API/users/${this.context.JWT.data.username}/visits`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.visitsSort(res.data.payload.result);
			})
			.catch((err) => console.log(err))
	}

	getUsersOnline = () => {
		const mySocket = io('http://localhost:5000');
		mySocket.on('notification', notification => {
			if (notification.type === 'isOnline') {
				let onlineUsers = [];
				let j = 0;
				for (let i = 0; i < notification.result.length; i++) {
					if (notification.result[i].isOnline === true) {
						onlineUsers[j++] = { name: notification.result[i].username };
					}
				}
				this.setState({ usersOnline: onlineUsers }/*, function() { console.log(this.state.usersOnline); }*/);
			}
		});
	}

	matchesSort = (list) => {
		let sortedList = list;
		sortedList = _.orderBy(sortedList, ['matchCreation'], ['desc']);
		this.setState({ matchesList: sortedList }, function() { console.log(this.state.matchesList); });
	}

	visitsSort = (list) => {
		let sortedList = list;
		sortedList = _.orderBy(sortedList, ['date'], ['desc']);
		this.setState({ visitsHistoric: sortedList }, function() { console.log(this.state.visitsHistoric); });
	}

	render () {
		return (
			<MatchesDummy
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MatchesSmart;
