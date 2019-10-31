import React, { Component } from 'react';
import axios from 'axios';

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
			alertBox: null
		}
	}

	static contextType = UserContext;

	handleChange = (event, message) => {
		if (event.type === "click") {
			if (message === "confirm user") {
				console.log("message === confirm user")
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

	handleNextPic = (event, index) => {
		console.log("handleNextPic() triggered");
		console.log("dot index: " + index);
		event.preventDefault();
		const currSrcPic = this.props.user.photos[index];
		const nextSrcPic = this.props.user.photos[index + 1];
		console.log("div index: " + this.props.id);
		const currPicElem  = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("profilPicFront")[0];
		const nextPicElem = document.getElementsByClassName("back")[this.props.id].getElementsByClassName("profilPicBack")[index];
		console.log(currPicElem);
		console.log(nextPicElem);
		console.log(currSrcPic);
		console.log(nextSrcPic);
	}
	
	handleHeartClick = (e) => {
    const mySocket = this.context.socket;
    console.log(mySocket);
    console.log(this.context);
    mySocket.emit('notification', {
      type: 'like',
      emitter: 'philoutre',
      receiver: 'camille',
      });
		e.preventDefault();
		console.log(e.type);
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.liked;
			const userlike = usersnames.node_a;
			const userliked = usersnames.node_b;
			userlike.properties = { username: this.context.JWT.data.username };
			userliked.properties = { username: this.props.user.username };
			this.setState({
				liked: usersnames
			}, function () {console.log(this.state.liked)});

			axios
				.post('http://localhost:4000/API/relationships/toggle', this.state.liked)
				.then(response => {
					this.setState({ loading: false });
					if (response.data.success) {
						/* Dynamically changes the heart icon depending on if user liked or unliked someone */
						const addClass = response.data.payload.result.search("CREATED") !== -1 ? "fas" : "far";
						const removeClass = response.data.payload.result.search("CREATED") !== -1 ? "far" : "fas";
						const allElem = document.getElementsByClassName("empty_heart");
						const elem = allElem[this.props.id];
						elem.classList.add(addClass);
						elem.classList.remove(removeClass);

						/* If it's a match, display an alert to congrats */
						if (this.props.user.likedU === true && addClass === "fas") {
							this.setState({
								alertBox: {
									message:"This is a new match!",
									button:"YEAY!",
									color: "green"
								}
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
		console.log(this.props.user);
		return (
			<UserPageDummy 
				handleClickOutside={this.handleClickOutside.bind(this)}
				handleHeartClick={this.handleHeartClick.bind(this)}
				handleChange={this.handleChange.bind(this)}
				handleNextPic={this.handleNextPic.bind(this)}
				{...this.state}
				{...this.props}
			/>
		)
	}
}

export default UserPage;
