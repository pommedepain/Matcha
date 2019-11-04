import React, { Component } from 'react';
import io from 'socket.io-client';

import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';
import HomeDumb from './HomeD';

const TagDatas = require('../../Datas/tagSuggestions.json');

class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
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
			usersOnline: null,
		}
	}

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

		this.getSuggestions();
		this.updateFilters();
	}

	getSuggestions = () => {
		const { username, token } = this.context.JWT.data;

		if (username !== undefined) {
			axios.get(`http://localhost:4000/API/users/suggestions/${username}`, {headers: {"x-auth-token": token}})
				.then(response => {
					// console.log(response.data.payload.result);
					let suggestions = []
					response.data.payload.result.map((elem, i) => {
						if (this.state.popularityRange[0] <= elem.user.popularity) {
							suggestions[i] = elem; 
						}
						return (suggestions);
					})
					this.setState({ suggestions: suggestions });
				})
				.catch(err => { 
					console.log(err);
				})
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
		}/*, function () { console.log(this.state)}*/);
	}

	handleSlider = (newValue) => {
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

	popupUser = (e, id) => {
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
		// console.log(this.state.suggestions[id]);
	}

	submit = (e) => {
		e.preventDefault();
		const { username, token } = this.context.JWT.data;
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

		console.log(newFilters)
		if (username !== undefined) {
			axios.put(`http://localhost:4000/API/users/update/${username}`, newFilters, {headers: {"x-auth-token": token}})
				.then(response => {
					this.context.toggleUser(response.data.payload.result);
					this.getSuggestions();
				})
				.catch(err => { 
					console.log(err);
				})
		}
	}

	render() {
		return (
			<HomeDumb 
				submit={this.submit.bind(this)}
				popupUser={this.popupUser.bind(this)}
				handleAddition={this.handleAddition.bind(this)}
				handleDelete={this.handleDelete.bind(this)}
				handlePopularityRange={this.handlePopularityRange.bind(this)}
				handleAgeRange={this.handleAgeRange.bind(this)}
				handleSlider={this.handleSlider.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Home;
