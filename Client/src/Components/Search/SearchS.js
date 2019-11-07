import React, { Component } from 'react';
import axios from 'axios';

import SearchDummy from './SearchD';
import { UserContext } from '../../Contexts/UserContext';

const TagDatas = require('../../Datas/tagSuggestions.json');

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
		filters: [
			{ value: "distance", displayValue: "Distance", id: "distance" },
			{ value: "ageMax", displayValue: "Maximum age value", id: "ageMax" },
			{ value: "ageMin", displayValue: "Minimum age value", id: "ageMin" },
			{ value: "popularity", displayValue: "Popularity", id: "popularity" },
			{ value: "tags", displayValue: "Tags", id: "tags" },
		],
		filterBy: "",
		currentLocation: null
	};

	static contextType = UserContext;

	componentDidMount () {
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
				});
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
						this.setState({ currentLocation: currentCoords }, function() {console.log(this.state.currentLocation)});
					})
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
						});
						axios.put(`http://localhost:4000/API/users/update/${this.context.JWT.data.username}`, {lat: position.data.payload.localisation.latitude, lon: position.data.payload.localisation.longitude}, {headers: {'x-auth-token': this.context.JWT.token}});
						return axios.get(`http://localhost:4000/API/locate/reverseGeocode/${position.data.payload.localisation.latitude}/${position.data.payload.localisation.longitude}`)
					})
					.then((res) => {
						const datas = res.data.payload.adress.address;
						const currentCoords = this.state.currentLocation;
						currentCoords['adress'] = datas.road;
						currentCoords['city'] = datas.village;
						currentCoords['state'] = datas.state;
						currentCoords['postcode'] = datas.postcode;
						currentCoords['country'] = datas.country;
						this.setState({ currentLocation: currentCoords }, function() {console.log(this.state.currentLocation)});
					})
				}
			})
		}
	}

	handleSearch = (event) => {
		const { name, value } = event.target;
		console.log(name);
		console.log(value);
		this.setState({ [name]: value });
		for (let i = 0; i < this.state.suggestions.length; i++) {
			if (this.state.suggestions[i].user.username[0] === value ||
				this.state.suggestions[i].user.firstName[0] === value ||
				this.state.suggestions[i].user.lastName[0] === value) {
				console.log(this.state.suggestions[i].user.username);
			}
		}
	}

	handleFilterBy = (event) => {
		const {name, value, checked, type} = event.target;
		console.log(name);
		type === "checkbox" ? this.setState({ [name]: checked }) : this.setState({ [name]: value });
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
				handleSlider={this.handleSlider.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Search;
