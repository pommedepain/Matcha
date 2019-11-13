import React, { Component } from 'react';

import MessagesDummy from './MessagesD';
import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';

class MessagesSmart extends Component {
	state = {
		matchList: [],
	};

	static contextType = UserContext;

	componentDidMount() {
		axios.get(`http://localhost:4000/API/users/matches/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
	}

	render() {
		return (
			<MessagesDummy
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MessagesSmart;
