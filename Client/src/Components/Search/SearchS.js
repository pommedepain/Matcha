import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

import SearchDummy from './SearchD';
import { UserContext } from '../../Contexts/UserContext';
import distance from '../Geolocalisation/distance';

const TagDatas = require('../../Datas/tagSuggestions.json');
const _ = require('lodash');

class Search extends Component {
	state = {
		ageRange: [18, 25],
		popularityRange: [0, 100],
		localisation: 5,
		tags: [],
		touched: {
			ageRange: false,
			popularityRange: false,
			localisation: false,
			tags: false
		},
		suggestions: null,
		searchbar: "",
		searchbarIndex: 0,
		filters: [
			{ value: "distance", displayValue: "Distance", id: "distance" },
			{ value: "ageMax", displayValue: "Maximum age value", id: "ageMax" },
			{ value: "ageMin", displayValue: "Minimum age value", id: "ageMin" },
			{ value: "popularity", displayValue: "Popularity", id: "popularity" },
			{ value: "tags", displayValue: "Tags", id: "tags" },
		],
		filterBy: "",
		currentLocation: null, 
		usersOnline: null,
		suggestionsSearched: [],
		submitButton: false
	};

	static contextType = UserContext;

	componentDidMount () {
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

		this.updateFilters();
		this.getLocation();
		this.getSuggestions();
	}

	getSuggestions = () => {
		const { username } = this.context.JWT.data;
		const { token } = this.context.JWT;
	
		if (username !== undefined) {
			axios.get(`http://localhost:4000/API/users/suggestions/${username}`, {headers: {"x-auth-token": token}})
				.then(response => {
					let suggestions = [];
					response.data.payload.result.map((elem, i) => {
						if (this.state.currentLocation) {
							const toCompute = {
								user1: {lat: this.state.currentLocation.lat, lon: this.state.currentLocation.lng}, 
								user2: {lat: elem.user.lat, lon: elem.user.lon}
							};
							const ret = distance(toCompute.user1, toCompute.user2);
							elem.user['distance'] = ret;
						}
						if (this.state.popularityRange[0] <= elem.user.popularity) {
							suggestions[i] = elem; 
						}
						return (suggestions);
					})
					this.state.submitButton ?
					this.setState({ suggestionsSearched: suggestions })
					: this.setState({ suggestions: suggestions });
				})
				.catch(err => { 
					console.log(err);
				})
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
					axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, {lat: coords.latitude, lon: coords.longitude}, {headers: {'x-auth-token': this.context.JWT.token}});
					axios.get(`http://localhost:4000/API/locate/reverseGeocode/${coords.latitude}/${coords.longitude}`)
						.then((res) => {
							const datas = res.data.payload.adress.address;
							const currentCoords = this.state.currentLocation;
							currentCoords['adress'] = datas.road;
							currentCoords['city'] = datas.village;
							currentCoords['state'] = datas.state;
							currentCoords['postcode'] = datas.postcode;
							currentCoords['country'] = datas.country;
							this.setState({ currentLocation: currentCoords });
						})
				});
			},
			error => {
				if (error.code === error.PERMISSION_DENIED) {
				console.log('geoloc denied');
				axios.get('http://localhost:4000/API/locate/geocode')
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
							axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, {lat: position.data.payload.localisation.latitude, lon: position.data.payload.localisation.longitude}, {headers: {'x-auth-token': this.context.JWT.token}});
							axios.get(`http://localhost:4000/API/locate/reverseGeocode/${position.data.payload.localisation.latitude}/${position.data.payload.localisation.longitude}`)
								.then((res) => {
									console.log(res);
									const datas = res.data.payload.adress.address;
									const currentCoords = this.state.currentLocation;
									currentCoords['adress'] = datas.road;
									currentCoords['city'] = datas.village;
									currentCoords['state'] = datas.state;
									currentCoords['postcode'] = datas.postcode;
									currentCoords['country'] = datas.country;
									this.setState({ currentLocation: currentCoords }, function() {console.log(this.state.currentLocation)});
								})
						});
					})
				}
			})
		}
	}

	handleSearch = (event) => {
		const { value } = event.target;
		this.setState({ searchbar: value }, function () { 
			let suggestionsSearched = this.state.suggestions;

			suggestionsSearched = _.filter(this.state.suggestions, (elem) => {

				return elem.user.username.includes(this.state.searchbar) === true
					|| elem.user.firstName.includes(this.state.searchbar) === true
					|| elem.user.lastName.includes(this.state.searchbar) === true;
			});

			this.setState({ suggestionsSearched: suggestionsSearched });
		});
	}

	distanceSort = () => {
		if (this.state.submitButton === true && this.state.currentLocation) {
			let sortedArray = [];
			let j = 0;
			this.state.suggestionsSearched.map((elem) => {
				if (elem.user.distance <= this.state.localisation) {
					return (sortedArray[j++] = elem);
				}
				else return null;
			})
			sortedArray = _.orderBy(sortedArray, ['user.distance'], ['asc']);
			this.setState({ suggestionsSearched: sortedArray });
		}
		else if (this.state.suggestions) {
			let sortedArray = [];
			let j = 0;
			this.state.suggestions.map((elem) => {
				if (elem.user.distance <= this.state.localisation) {
					return (sortedArray[j++] = elem);
				}
				else return null;
			})
			sortedArray = _.orderBy(sortedArray, ['user.distance'], ['asc']);
			this.setState({ suggestions: sortedArray });
		}
	}

	ageMinSort = () => {
		if (this.state.submitButton === true) {
			let sortedArray = this.state.suggestionsSearched;
			sortedArray = _.orderBy(sortedArray, ['user.age'], ['asc']);
			this.setState({ suggestionsSearched: sortedArray });
		}
		else if (this.state.suggestions) {
			let sortedArray = this.state.suggestions;
			sortedArray = _.orderBy(sortedArray, ['user.age'], ['asc']);
			this.setState({ suggestions: sortedArray });
		}
	}

	ageMaxSort = () => {
		if (this.state.submitButton === true) {
			let sortedArray = this.state.suggestionsSearched;
			sortedArray = _.orderBy(sortedArray, ['user.age'], ['desc']);
			this.setState({ suggestionsSearched: sortedArray });
		}
		else if (this.state.suggestions) {
			let sortedArray = this.state.suggestions;
			sortedArray = _.orderBy(sortedArray, ['user.age'], ['desc']);
			this.setState({ suggestions: sortedArray });
		}
	}

	popularitySort = () => {
		if (this.state.submitButton === true) {
			let sortedArray = this.state.suggestionsSearched;
			sortedArray = _.orderBy(sortedArray, ['user.popularity'], ['desc']);
			this.setState({ suggestionsSearched: sortedArray });
		}
		else if (this.state.suggestions) {
			let sortedArray = this.state.suggestions;
			sortedArray = _.orderBy(sortedArray, ['user.popularity'], ['desc']);
			this.setState({ suggestions: sortedArray });
		}
	}

	tagsSort = () => {
		let sortedArray = [];
		if (this.context.JWT.data.lookTags) {
			if (this.state.submitButton === true) {
				this.state.suggestionsSearched.map((elem) => {
					this.tagSortCount = 0;
					this.context.JWT.data.lookTags.forEach((tag) => {
						elem.user.isTags.forEach((isTag) => {
							if (isTag.id === tag.id) return this.tagSortCount += 1;
						})
					})
	
					if (this.tagSortCount === this.context.JWT.data.lookTags.length) return sortedArray.push(elem);
					else return null;
				})
				this.setState({ suggestionsSearched: sortedArray });
			}
			else if (this.state.suggestions) {
				this.state.suggestions.map((elem) => {
					this.tagSortCount = 0;
					this.context.JWT.data.lookTags.forEach((tag) => {
						elem.user.isTags.forEach((isTag) => {
							if (isTag.id === tag.id) return this.tagSortCount += 1;
							else return null;
						})
					})
					if (this.tagSortCount === this.context.JWT.data.lookTags.length) return sortedArray.push(elem);
					else return null;
				})
				this.setState({ suggestions: sortedArray });
			}
		}
	}

	handleFilterBy = (event) => {
		const {name, value, checked, type} = event.target;
		type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });

		switch (value) {
			case 'distance':
				if (this.state.currentLocation) {
					this.distanceSort();
				}
				break;
			case 'ageMin':
				this.ageMinSort();
				break;
			case 'ageMax':
				this.ageMaxSort();
				break;
			case 'popularity':
				this.popularitySort();
				break;
			case 'tags':
				this.tagsSort();
				break;
			default:
				break ;
		}
	}

	updateFilters = () => {
		const { ageMin, ageMax, lookTags, localisation } = this.context.JWT.data;
		let tags = null;

		if (lookTags === undefined) {
			tags = [];
		}
		else {
			tags = lookTags;
		}

		this.setState({
			ageRange: [ageMin, ageMax],
			tags: tags,
			localisation: localisation
		});
	}

	handleLocation = (newValue) => {
		let localisationTouched = this.state.touched;
		localisationTouched.localisation = true;

		this.setState({
			localisation: newValue,
			touched: localisationTouched
		});
	}

	handleAgeRange = (newValue) => {
		let ageRangeTouched = this.state.touched;
		ageRangeTouched.ageRange = true;

		this.setState({
			ageRange: newValue,
			touched: ageRangeTouched
		})
	}

	handlePopularityRange = (newValue) => {
		let popularityTouched = this.state.touched;
		popularityTouched.popularityRange = true;

		this.setState({
			popularityRange: newValue,
			touched: popularityTouched
		});
	}

	handleDelete = (i) => {
		const { tags } = this.state
		let tagsTouched = this.state.touched;
		tagsTouched.tags = true;

		this.setState({
			touched: tagsTouched,
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		let tagsTouched = this.state.touched;
		tagsTouched.tags = true;

		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				return (this.setState(
					state => ({ 
						tags: [...state.tags, tag],
						touched: tagsTouched })
				));
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
	}

	submit = (e) => {
		e.preventDefault();
    	const { username } = this.context.JWT.data;
    	const { token } = this.context.JWT;
		let newFilters = {};
		if (this.state.touched.ageRange === true) {
			newFilters['ageMin'] = this.state.ageRange[0];
			newFilters['ageMax'] = this.state.ageRange[1];
		}
		if (this.state.touched.localisation === true) {
			newFilters['localisation'] = this.state.localisation;
		}
		if (this.state.touched.tags === true) {
			newFilters['tags'] = this.state.tags;
		}

		/* Changes the filters infos of this user and get a new list of suggestions according to his/her new filters */
		if (username !== undefined && (newFilters.ageMax || newFilters.localisation || newFilters.tags)) {
			console.log(newFilters)
			axios.put(`http://localhost:4000/API/users/update/${username}`, newFilters, {headers: {"x-auth-token": token}})
				.then(response => {
					console.log(response)
					this.context.toggleUser(response.data.payload.result.token);
					this.getSuggestions();
					this.setState({ 
						submitButton: true,
						filterBy: ""
					});
				})
				.catch(err => { 
					console.log(err);
				})
		}
		else if (username !== undefined && (!newFilters.ageMax || !newFilters.localisation || !newFilters.tags)) {
			this.getSuggestions();
			this.setState({ 
				submitButton: true,
				filterBy: ""
			});
		}
	}

	popupUser = (e, id) => {
		console.log(id);
		e.preventDefault();
		const users = document.querySelectorAll('.back');
		const underDiv = document.querySelectorAll('.underDiv');
		users[id].style.display = "flex";
		underDiv[id].style.display = "flex";
		document.getElementById("main").style.filter = 'blur(3px)';

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
		axios.post('http://localhost:4000/API/notifications/create', newNotification, {headers: {"x-auth-token": this.context.JWT.token}})
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

	render () {
		return (
			<SearchDummy
				handleSearch={this.handleSearch.bind((this))}
				handleFilterBy={this.handleFilterBy.bind(this)}
				submit={this.submit.bind(this)}
				handleAddition={this.handleAddition.bind(this)}
				handleDelete={this.handleDelete.bind(this)}
				handlePopularityRange={this.handlePopularityRange.bind(this)}
				handleAgeRange={this.handleAgeRange.bind(this)}
				handleLocation={this.handleLocation.bind(this)}
				popupUser={this.popupUser.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Search;
