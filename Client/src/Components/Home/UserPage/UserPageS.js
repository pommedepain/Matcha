import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import UserPageDummy from './UserPageD';
import { UserContext } from '../../../Contexts/UserContext';

class UserPage extends Component {
	constructor (props) {
		super(props);
		this.state = {
			liked: {
				node_a: {
					label: "User",
					id: "username",
					properties: {}
				},
				node_b: {
					label: "User",
					id: "username",
					properties: {}
				},
				relation: {
					label: "LIKES",
					properties: {}
				}
			},
			block: {
				node_a: {
					label: "User",
					id: "username",
					properties: {}
				},
				node_b: {
					label: "User",
					id: "username",
					properties: {}
				},
				relation: {
					label: "BLOCK",
					properties: {}
				}
			},
			fake: {
				node_a: {
					label: "User",
					id: "username",
					properties: {}
				},
				node_b: {
					label: "User",
					id: "username",
					properties: {}
				},
				relation: {
					label: "FAKE_ACCOUNT",
					properties: {}
				}
			},
			alertBox: null
		}
	}


	static contextType = UserContext;

	handleChange = (event, message) => {
		if (event.type === "click") {
			if (message === "confirm user") {
				this.setState({
					alertBox: null
				})
			}
			else {
				event.preventDefault();
				this.setState({
					alertBox: null
				});	
			}
		}
	}

	handleThisPic = (event, index) => {
		event.preventDefault();
		const thisDot = event.target;
		const dotFront = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("dotFront")[0];
		const thisPic = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("profilPic")[index];
		const frontPic = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("profilPicFront")[0];
		
		/* Make front picture and dot basic */
		frontPic.classList.remove("profilPicFront");
		dotFront.classList.remove("dotFront");
		frontPic.style.display = 'none';
		dotFront.style.backgroundColor = '#FDF38A';

		/* Make dot clicked and associated picture, front ones */
		thisPic.classList.add("profilPicFront");
		thisDot.classList.add("dotFront");
		thisPic.style.display = 'inline';
		thisDot.style.backgroundColor = "#524A54";
	}
	
	handleHeartClick = (e) => {
		console.log("handleHeartClick() triggered");
		e.preventDefault();
		const token = this.context.JWT.token;
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.liked;
			const userlike = usersnames.node_a;
			const userliked = usersnames.node_b;
			userlike.properties = { username: this.context.JWT.data.username };
			userliked.properties = { username: this.props.user.username };
			this.setState({
				liked: usersnames
			}, function() { console.log(this.state.liked); });

			axios
				.post('http://localhost:4000/API/relationships/toggle', this.state.liked, {headers: {"x-auth-token": token}})
				.then(response => {
					console.log(response.data);
					this.setState({ loading: false });
	
					if (response.data.success) {
						/* Dynamically changes the heart icon depending on if user liked or unliked someone */
						const addClass = response.data.payload.result.search("CREATED") !== -1 ? "fas" : "far";
						const removeClass = response.data.payload.result.search("CREATED") !== -1 ? "far" : "fas";
						const allElem = document.getElementsByClassName("empty_heart");
						const elem = allElem[this.props.id];
						elem.classList.add(addClass);
						elem.classList.remove(removeClass);
						const newNotification = {
							emitter: this.context.JWT.data.username,
							receiver: this.props.user.username,
							type: null,
							new: true
						};

						console.log("this user liked u?: " + this.props.user.likedU);
						console.log(addClass);
						/* If the user liked someone, send a notification 'like' to the receiver */
						if (addClass === "fas" && this.props.user.likedU === false) {
							console.log("user liked someone, send a notification 'like'")
							const mySocket = io('http://localhost:5000');
							const ret = mySocket.emit('notification', {
								type: 'like',
								emitter: this.context.JWT.data.username,
								receiver: this.props.user.username,
							})
							console.log(ret);
							newNotification.type = 'like';
							axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}})
								.then((response) => {
									if (response.data.payload.result === "Missing information") {
										console.log(response.data.payload.result);
									}
									else {
										console.log("like sent to db successfully");
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}
						/* If the user unliked someone, create a notification 'unlike' that will not be displayed */
						else if (addClass === "far" && this.props.user.likedU === false /*&& this.context.notifications*/) {
							const mySocket = io('http://localhost:5000');
							const ret = mySocket.emit('notification', {
								type: 'unlike',
								emitter: this.context.JWT.data.username,
								receiver: this.props.user.username,
							})
							console.log(ret);
							newNotification.type = 'unlike';
							axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}})
								.then((response) => {
									if (response.data.payload.result === "Missing information") {
										console.log(response.data.payload.result);
									}
									else {
										console.log("unlike sent to db successfully");
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}

						/* If the user unlike someone that was previously a match, send an "unmatch" notification to both emitter and receiver to warn */
						else if (addClass === "far" && this.props.user.likedU === true) {
							console.log("user unlike someone that was previously a match, send an 'unmatch'");
							const mySocket = io('http://localhost:5000');
							const ret = mySocket.emit('notification', {
								type: 'unmatch',
								emitter: this.context.JWT.data.username,
								receiver: this.props.user.username,
							})
							mySocket.emit('notification', {
								type: 'unmatch',
								emitter: this.props.user.username,
								receiver: this.context.JWT.data.username,
							})
							console.log(ret);
							newNotification.type = 'unmatch';
							axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}})
								.then((response) => {
									if (response.data.payload.result === "Missing information") {
										console.log(response.data.payload.result);
									}
									else {
										console.log("unmatch sent to db successfully");
									}
								})
								.catch((err) => {
									console.log(err);
								})
							const myUnmatchNotif = {
								emitter: this.props.user.username,
								receiver: this.context.JWT.data.username,
								type: 'unmatch',
								new: true
							}
							axios.post('http://localhost:4000/API/notifications/create',myUnmatchNotif, {headers: {"x-auth-token": this.context.JWT.token}})
									.then((response) => {
										if (response.data.payload.result === "Missing information") {
											console.log(response.data.payload.result);
										}
										else {
											console.log("unmatch sent to self in db successfully");
										}
									})
									.catch((err) => {
										console.log(err);
									})
						}

						/* If it's a match, sends a notification to both emitter and receiver to congrats */
						if (this.props.user.likedU === true && addClass === "fas") {
							console.log("user just matched someone");
							const mySocket = io('http://localhost:5000');
							const ret = mySocket.emit('notification', {
								type: 'match',
								emitter: this.context.JWT.data.username,
								receiver: this.props.user.username,
							})
							mySocket.emit('notification', {
								type: 'match',
								emitter: this.props.user.username,
								receiver: this.context.JWT.data.username,
							})
							console.log(ret);
							newNotification.type = 'match';
							axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}})
								.then((response) => {
									if (response.data.payload.result === "Missing information") {
										console.log(response.data.payload.result);
									}
									else {
										console.log("match sent to target in db successfully");
									}
								})
								.catch((err) => {
									console.log(err);
								})
							const myMatchNotif = {
								emitter: this.props.user.username,
								receiver: this.context.JWT.data.username,
								type: 'match',
								new: true
							}
							axios.post('http://localhost:4000/API/notifications/create',myMatchNotif, {headers: {"x-auth-token": this.context.JWT.token}})
								.then((response) => {
									if (response.data.payload.result === "Missing information") {
										console.log(response.data.payload.result);
									}
									else {
										console.log("match sent to self in db successfully");
									}
								})
								.catch((err) => {
									console.log(err);
								})
						}
					}
				})
				.catch(error => {
					this.setState({ loading: false });
					console.log(error);
				})
		}
	}

	handleBlock = (e) => {
		e.preventDefault();
		const token = this.context.JWT.token;
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.block;
			const userblock = usersnames.node_a;
			const userblocked = usersnames.node_b;
			userblock.properties = { username: this.context.JWT.data.username };
			userblocked.properties = { username: this.props.user.username };
			this.setState({
				block: usersnames
			}, function () { console.log(this.state.block )});
		}

		axios.post('http://localhost:4000/API/relationships/toggle', this.state.block, {headers: {"x-auth-token": token}})
			.then(response => {
				this.setState({ loading: false });
				console.log(response.data);
				if (response.data.success) {
					/* Dynamically changes the css display of block to mark as active and making it unclickable */
					const allElem = document.getElementsByClassName("block");
					const elem = allElem[this.props.id];
					elem.style.color = "#ff665e9f";
					elem.disabled = true;

					document.location.reload(false);
				}
			})
			.catch(error => {
				this.setState({ loading: false });
				console.log(error);
			})
	}

	handleFake = (e) => {
		e.preventDefault();
		const token = this.context.JWT.token;
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.fake;
			const userfake = usersnames.node_a;
			const userfaked = usersnames.node_b;
			userfake.properties = { username: this.context.JWT.data.username };
			userfaked.properties = { username: this.props.user.username };
			this.setState({
				fake: usersnames
			}, function () { console.log(this.state.fake )});
		}

		axios.post('http://localhost:4000/API/relationships/toggle', this.state.fake, {headers: {"x-auth-token": token}})
			.then(response => {
				this.setState({ loading: false });
				console.log(response.data);
				if (response.data.success) {
					/* Dynamically changes the css display of fake to mark as active and making it unclickable */
					const color = response.data.payload.result.search("CREATED") !== -1 ?  "#ff665e" : "#524A54";
					const allElem = document.getElementsByClassName("fake");
					const elem = allElem[this.props.id];
					elem.style.color = color;
				}
			})
			.catch(error => {
				this.setState({ loading: false });
				console.log(error);
			})
		
	}

	handleClickOutside = (e) => {
		e.preventDefault();
		if (e.target.classList.contains("underDiv")) {
			const id = e.target.id;
			const users = document.querySelectorAll('.back');
			const underDiv = document.querySelectorAll('.underDiv');
			users[id].style.display = "none";
			underDiv[id].style.display = "none";
			document.getElementById("main").style.filter = 'blur(0)'
		}
	}

	render () {
		// console.log(this.props.user);
		return (
			<UserPageDummy 
				handleClickOutside={this.handleClickOutside.bind(this)}
				handleHeartClick={this.handleHeartClick.bind(this)}
				handleChange={this.handleChange.bind(this)}
				handleThisPic={this.handleThisPic.bind(this)}
				handleBlock={this.handleBlock.bind(this)}
				handleFake={this.handleFake.bind(this)}
				{...this.state}
				{...this.props}
			/>
		)
	}
}

export default UserPage;
