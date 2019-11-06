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
	};

	static contextType = UserContext;

	componentDidMount () {
		this.updateFilters();
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
