import React, { Component } from 'react';
import io from 'socket.io-client';

import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';
import HomeDumb from './HomeD';
import distance from '../Geolocalisation/distance';

const _ = require('lodash');

class Home extends Component {
	_isMounted = false;

	constructor (props) {
		super(props);
		this.state = {
			suggestions: null,
			usersOnline: null,
			displayInput: {display: 'none'},
			currentLocation: null
		}
	}

	static contextType = UserContext;

	CancelToken = axios.CancelToken;
  	source = this.CancelToken.source();
	abortController = new AbortController();

	componentDidMount () {
		this._isMounted = true;

		if (this._isMounted) {
			const mySocket = io('http://localhost:5000');
			mySocket.on('notification', notification => {
				if (notification.type === 'isOnline') {
					let onlineUsers = [{ howMany: 0 }];
					for (let i = 0; i < notification.result.length; i++) {
						if (notification.result[i].isOnline === true) {
							onlineUsers[0].howMany += 1;
							onlineUsers[notification.result[i].username] = true;
						}
					}
					this.setState({ usersOnline: onlineUsers }, function() { console.log(this.state.usersOnline); });
				}
			});

			this.getLocation();
		}
	}

	/* Make sure that the infos such as "username liked you" displayed on their profil are updated immediately */
	componentDidUpdate () {
		if (this.context.newNotif.new === true) {
			console.log("new notif in localStorage detected in HOMES");
			this.getSuggestions();
		}
	}

	getLocation = () => {
		if (navigator && navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(pos => {
				const coords = pos.coords;
				this.setState({
					currentLocation: {
						denied: false,
						lat: coords.latitude,
						lng: coords.longitude
					}
				}, function () {
					axios.get(`http://localhost:4000/API/locate/reverseGeocode/${coords.latitude}/${coords.longitude}`, { signal: this.abortController.signal })
						.then((res) => {
							const datas = res.data.payload.adress.address;
							const currentCoords = this.state.currentLocation;
							currentCoords['adress'] = datas.road;
							currentCoords['city'] = datas.village;
							currentCoords['state'] = datas.state;
							currentCoords['postcode'] = datas.postcode;
							currentCoords['country'] = datas.country;
							this.setState({ currentLocation: currentCoords }, function() {
								console.log(this.state.currentLocation); 
								this.getSuggestions();
							});
						})
				});
			},
			error => {
				if (error.code === error.PERMISSION_DENIED) {
				console.log('geoloc denied');
				axios.get('http://localhost:4000/API/locate/geocode', { signal: this.abortController.signal })
					.then((position) => {
						this.setState({
							currentLocation: {
								denied: true,
								lat: position.data.payload.localisation.latitude,
								lng: position.data.payload.localisation.longitude
							}
						}, function () {
							console.log(position.data.payload.localisation.latitude);
							console.log(position.data.payload.localisation.longitude);
							axios.get(`http://localhost:4000/API/locate/reverseGeocode/${position.data.payload.localisation.latitude}/${position.data.payload.localisation.longitude}`, { signal: this.abortController.signal })
								.then((res) => {
									console.log(res);
									const datas = res.data.payload.adress.address;
									const currentCoords = this.state.currentLocation;
									currentCoords['adress'] = datas.road;
									currentCoords['city'] = datas.village;
									currentCoords['state'] = datas.state;
									currentCoords['postcode'] = datas.postcode;
									currentCoords['country'] = datas.country;
									this.setState({ currentLocation: currentCoords }, function() {
										console.log(this.state.currentLocation); 
										this.getSuggestions();
									});
								})
						});
					})
				}
			})
		}
	}

	getSuggestions = () => {
    	const { username } = this.context.JWT.data;
    	const { token } = this.context.JWT;

		if (username !== undefined) {
			axios.get(`http://localhost:4000/API/users/suggestions/${username}`, {headers: {"x-auth-token": token}}, { signal: this.abortController.signal })
				.then(response => {
					let suggestions = response.data.payload.result;
					response.data.payload.result.map((elem, i) => {
						if (this.state.currentLocation) {
							const toCompute = {
								user1: {lat: this.state.currentLocation.lat, lon: this.state.currentLocation.lng}, 
								user2: {lat: elem.user.lat, lon: elem.user.lon}
							};
							const ret = distance(toCompute.user1, toCompute.user2);
							elem.user['distance'] = ret;
							console.log(ret);
							suggestions[i] = elem;
						}
						return (suggestions);
					})
					this.filterByDistance(suggestions);
				})
				.catch(err => { 
					console.log(err);
				})
		}
	}

	filterByDistance = (suggestions) => {
		if (this.state.currentLocation && suggestions) {
				let sortedArray = [];
				let j = 0;
				suggestions.map((elem) => {
					if (elem.user.distance <= this.context.JWT.data.localisation) {
						return (sortedArray[j++] = elem);
					}
					else return null;
				});
				sortedArray = _.orderBy(sortedArray, ['user.distance'], ['asc']);
				this.setState({ suggestions: sortedArray }, function() { console.log(this.state.suggestions)});
		}
	}

	popupUser = (e, id) => {
		e.preventDefault();
		const users = document.querySelectorAll('.back');
		const underDiv = document.querySelectorAll('.underDiv');
		users[id].style.display = "flex";
		underDiv[id].style.display = "flex";
		document.getElementById("main").style.filter = 'blur(3px)';
		console.log("likedU: " + this.state.suggestions[id].user.likedU);
		console.log("Uliked: " + this.state.suggestions[id].user.Uliked);

		/* Creates a visit notification to receiver */
		const mySocket = io('http://localhost:5000');
		mySocket.emit('notification', {
			type: 'visit',
			emitter: this.context.JWT.data.username,
			receiver: this.state.suggestions[id].user.username,
		})

		const newNotification = {
			emitter: this.context.JWT.data.username,
			receiver: this.state.suggestions[id].user.username,
			type: 'visit',
			new: true
		}
		axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}}, { signal: this.abortController.signal })
			.then((response) => {
				if (response.data.payload.result === "Missing information") {
					console.log(response.data.payload.result);
				}
				else {
					console.log("visit sent to db successfully");
				}
			})
			.catch((err) => {
				console.log(err);
			})
	}
	
	componentWillUnmount() {
		this._isMounted = false;
		this.abortController.abort();
	}

	render() {
		return (
			<HomeDumb 
				popupUser={this.popupUser.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Home;
