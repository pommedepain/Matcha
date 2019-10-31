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
    const mySocket = this.context.socket;
    console.log(mySocket);
    console.log(this.context);
    mySocket.emit('notification', {
      type: 'like',
      emitter: 'philoutre',
      receiver: 'camille',
      });
		e.preventDefault();
		if (e.type === "click") {
			/* Construction of node to send to db */
			const usersnames = this.state.liked;
			const userlike = usersnames.node_a;
			const userliked = usersnames.node_b;
			userlike.properties = { username: this.context.JWT.data.username };
			userliked.properties = { username: this.props.user.username };
			this.setState({
				liked: usersnames
			});

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

	handleBlock = (e) => {
		e.preventDefault();
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

		axios.post('http://localhost:4000/API/relationships/toggle', this.state.block)
			.then(response => {
				this.setState({ loading: false });
				console.log(response.data);
				if (response.data.success) {
					/* Dynamically changes the css display of block to mark as active and making it unclickable */
					const allElem = document.getElementsByClassName("block");
					console.log(allElem);
					console.log(this.props.id);
					const elem = allElem[this.props.id];
					elem.style.color = "red";
					elem.style.pointerEvents = 'none';
					
					/* notif de block */
					// if () {
						
					// }
				}
			})
			.catch(error => {
				this.setState({ loading: false });
				console.log(error);
			})
	}

	handleFake = (e) => {
		e.preventDefault();
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

		axios.post('http://localhost:4000/API/relationships/toggle', this.state.fake)
			.then(response => {
				this.setState({ loading: false });
				console.log(response.data);
				if (response.data.success) {
					/* Dynamically changes the css display of fake to mark as active and making it unclickable */
					const allElem = document.getElementsByClassName("fake");
					const elem = allElem[this.props.id];
					console.log(allElem);
					console.log(this.props.id);
					elem.style.color = "red";
					elem.style.pointerEvents = 'none';
					
					/* notif de block */
					// if () {
						
					// }
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
		console.log(this.props.user);
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
