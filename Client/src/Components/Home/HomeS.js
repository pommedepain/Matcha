import React, { Component } from 'react';

import { UserContext } from '../../Contexts/UserContext';
import axios from 'axios';
import HomeDumb from './HomeD';

const TagDatas = require('../../Datas/tagSuggestions.json');

class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			ageRange: [18, 25],
			ageRangeTouched: false,
			scoreRange: [50, 100],
			scoreRangeTouched: false,
			localisation: 5,
			sliderTouched: false,
			tags: [],
			touched: false,
			suggestions: null
		}
	}

	static contextType = UserContext;

	componentDidMount () {
		this.getSuggestions();
		this.updateFilters();
	}

	getSuggestions = () => {
		const { username } = this.context.JWT.data;

		axios.get(`http://localhost:4000/API/users/suggestions/${username}`)
			.then(response => {
				// console.log(response.data.payload.result);
				this.setState({ suggestions: response.data.payload.result});
			})
			.catch(err => { 
				console.log(err);
			})
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
		this.setState({
			localisation: newValue,
			sliderTouched: true
		})
	}

	handleAgeRange = (newValue) => {
		this.setState({
			ageRange: newValue,
			ageRangeTouched: true
		})
	}

	handleScoreRange = (newValue) => {
		this.setState({
			scoreRange: newValue,
			scoreRangeTouched: true
		})
	}

	handleDelete = (i) => {
		const { tags } = this.state
		this.setState({
			touched: true,
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				return (this.setState(
					state => ({ 
						tags: [...state.tags, tag],
						touched: true })
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
	}

	submit = (e) => {
		e.preventDefault();
		console.log("apply filters");
	}

	render() {
		return (
			<HomeDumb 
				submit={this.submit.bind(this)}
				popupUser={this.popupUser.bind(this)}
				handleAddition={this.handleAddition.bind(this)}
				handleDelete={this.handleDelete.bind(this)}
				handleScoreRange={this.handleScoreRange.bind(this)}
				handleAgeRange={this.handleAgeRange.bind(this)}
				handleSlider={this.handleSlider.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Home;
