import React, { Component } from 'react';

import MessagesDummy from './MessagesD';
import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';

class MessagesSmart extends Component {
	state = {
		matchList: [],
		sendBar: {
			elementType: 'input',
			elementConfig: {
				type: "text",
				placeholder: "Write a message"
			},
			value: '',
			validation: {
				minLength: 1,
				maxLength: 255,
				regex: "^[%5Cw 0-9_-àæéèêëçàùûîïÀÆÉÈÊÇÀÛÙÜÎÏ,.;:?!'\"&%/]{1,255}$",
				rule: "You used invalid characters..."
			},
			valid: true,
			touched: false,
			errorMessage: "",
			title: 'sendBar'
		},
		messagesList: []
	};

	static contextType = UserContext;

	componentDidMount() {
		axios.get(`http://localhost:4000/API/users/matches/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.setState({ matchList: res.data.payload.result }, function() {console.log(this.state.matchList)})
			})
			.catch((err) => console.log(err))
	}

	getConversation = (e, username) => {
		e.preventDefault();
		console.log("getConversation triggered");
		console.log(username);
		axios.get(`http://localhost:4000/API/users/${username}/conversationWith/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.setState({ messagesList: res.data.payload.result[0].conversation }, function() {console.log(this.state.messagesList)})
			})
			.catch((err) => console.log(err))
	}

	render() {
		return (
			<MessagesDummy
				getConversation={this.getConversation.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MessagesSmart;
