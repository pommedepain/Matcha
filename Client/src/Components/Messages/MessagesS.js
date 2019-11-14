import React, { Component } from 'react';
import io from 'socket.io-client';

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
		messagesList: [],
		currentInterlocutor: null
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
		console.log(e.target);
		axios.get(`http://localhost:4000/API/users/${username}/conversationWith/${this.context.JWT.data.username}`, {headers: {"x-auth-token": this.context.JWT.token}})
			.then((res) => {
				this.setState({ 
					messagesList: res.data.payload.result[0].conversation,
					currentInterlocutor: username
				}, function() {console.log(this.state.messagesList)})
			})
			.catch((err) => console.log(err))
	}

	checkValidity(value, rules, inputIdentifier, state) {
		return new Promise (function (resolve, reject) {
			let isValid = true;
			let errorMessages = [];

			if (!rules) {
				resolve(true);
			}
			if (rules.required === true) {
				isValid = (value.trim() !== "") && isValid;
				if (inputIdentifier !== undefined && value.trim() === "")
				{	
					errorMessages.push("This field is required");
					reject(errorMessages);
				}
			}
			if (!rules.required) {
				if ((value.trim() === "")) {
					resolve(true);
				}
			}
			if (rules.minLength) {
				isValid = (value.length >= rules.minLength) && isValid;
				if (inputIdentifier !== undefined && (value.length < rules.minLength))
				{	
					errorMessages.push("This field requires at least " + rules.minLength + " characters");
					reject(errorMessages);
				}
			}
			if (rules.maxLength) {
				isValid = (value.length <= rules.maxLength) && isValid;
				if (inputIdentifier !== undefined && (value.length > rules.maxLength))
				{	
					errorMessages.push("This field must not exceed " + rules.maxLength + " characters");
					reject(errorMessages);
				}
			}
			if (rules.regex) {
				isValid = RegExp(unescape(rules.regex), 'g').test(value) && isValid;
				if (inputIdentifier !== undefined && (RegExp(unescape(rules.regex), 'g').test(value) === false))
				{	
					errorMessages.push(rules.rule);
					reject(errorMessages);
				}
			}
			if(!rules.db && !rules.checkEmail) {
				resolve(isValid);
			}
		});
	}

	inputChangedHandler = (event, inputIdentifier) => {
		const updatedOrderForm = {
			...this.state.sendBar
		};

		updatedOrderForm.value = event.target.value;
		this.checkValidity(updatedOrderForm.value, updatedOrderForm.validation, inputIdentifier, this.state)
			.then((response) => {
				// console.log(response);
				updatedOrderForm.valid = response;
				updatedOrderForm.touched = true;
				this.setState({ sendBar: updatedOrderForm }/*, function() {console.log(this.state.sendBar.value)}*/);
			})
			.catch((e) => {
				updatedOrderForm.valid = false;
				// console.log(e);
				updatedOrderForm.touched = true;
				updatedOrderForm.errorMessage = e;
				this.setState({ sendBar: updatedOrderForm });
			})
	}

	sendMessage = (e) => {
		e.preventDefault();
		console.log(this.state.sendBar.value);
		axios.post('http://localhost:4000/API/notifications/create', 
					{type:'message', 
					emitter: this.context.JWT.data.username, 
					receiver: this.state.currentInterlocutor, 
					message: this.state.sendBar.value}, 
					{headers: {"x-auth-token": this.context.JWT.token}}
				)
			.then((res) => {
				console.log(res)
			})
			.catch((err) => console.log(err))

		const mySocket = io('http://localhost:5000');
		mySocket.emit('notification', 
					{type:'message', 
					emitter: this.context.JWT.data.username, 
					receiver: this.state.currentInterlocutor});
	}

	render() {
		return (
			<MessagesDummy
				getConversation={this.getConversation.bind(this)}
				inputChangedHandler={this.inputChangedHandler.bind(this)}
				sendMessage={this.sendMessage.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MessagesSmart;
