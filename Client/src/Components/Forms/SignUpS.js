import React, { Component } from 'react';
// import PropTypes from 'prop-types'

import Form from './SignUpD';
import classes from './SignUp.module.css';

const axios = require('axios');
const datas = require('../../Datas/tagSuggestions.json');

class SignUp extends Component {
	// static propTypes = {
	// 	username: PropTypes.string.isRequired,
	// 	email: PropTypes.string.isRequired,
	// 	password: PropTypes.string.isRequired,
	// 	cPasswd: PropTypes.string.isRequired,
	// }

	state = {
		showPopup: false,
		showAlert: false,
		style: {},
		username: "",
		firstName: "", 
		lastName: "",
		birthdate: "",
		email: "",
		password: "",
		cPasswd: "",
		score: "",
		score2: "",
		gender: "",
		sexOrient: "",
		bio: "",
		range: [18, 25],
		localisation: 5,
		tags: [
			{ id: "athlete", text: "Athlete" },
			{ id: "geek", text: "Geek" }
		]
	}

	togglePopup = () => {
		this.state.showPopup ?
		this.setState({
			showPopup: !this.state.showPopup,
			style: {}
		}) :
		this.setState({
			showPopup: !this.state.showPopup,
			style: {
				filter: 'blur(3px)'
			}
		});
	}

	handleChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({[name]: value})
	}

	handleSlider = (newValue) => {
		this.setState(
			{localisation: newValue}
		)
	}

	handleRange = (newValue) => {
		this.setState(
			{range: newValue}
		)
	}

	passwordStrength = (event) => {
		const name = event.target.name
		const score = (name === "password" ? "score" : "score2")
		var zxcvbn = require('zxcvbn');
		event.preventDefault()
		let value = zxcvbn(event.target.value)
		event.target.value === "" ?
			this.setState({ 
				[score]: null,
				[name]: null
			})
		:
			this.setState({ 
				[score]: value.score,
				[name]: event.target.value
			})
	}

	handleDelete = (i) => {
		const { tags } = this.state
		this.setState({
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		for (let i = 0; i < datas.suggestions.length; i++)
		{
			if (datas.suggestions[i].text === tag.text)
			{
				console.log(tag)
				return (this.setState(
					state => ({ tags: [...state.tags, tag] })
				))
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
		// alert("Please choose a Tag amongst the suggestions");
	}

	nextStep = (props) => {
		let current_fs, next_fs; //fieldsets
		let progressBar;

		current_fs = props.target.parentElement;
		next_fs = current_fs.nextElementSibling;
		progressBar = current_fs.parentElement.childNodes[1].childNodes;
		
		// activate next step on progressbar
		for (let i = 0; i < progressBar.length; i++)
			if (progressBar[i].className.search(/active/i) === -1)
			{
				progressBar[i].classList.add(classes.active)
				break;
			}

		//show the next fieldset
		next_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	}


	previousStep = (props) => {
		let current_fs, previous_fs;
		let progressBar;

		current_fs = props.target.parentElement;
		previous_fs = current_fs.previousElementSibling;
		progressBar = current_fs.parentElement.childNodes[1].childNodes;

		for (let i = (progressBar.length - 1); i > 0; i--)
			if (progressBar[i].className.search(/active/i) !== -1)
			{
				progressBar[i].classList.remove(classes.active)
				break;
			}

		//show the previous fieldset
		previous_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	}

	submit = (event) => {
		console.log(this.state)
		event.preventDefault()
		const data = this.state

		axios.post('http://localhost:4000/API/users', {
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: data.password,
            birthdate: data.birthdate,
            email: data.email,
            bio: data.bio,
            gender: data.gender,
            ageMin: data.range[0],
            ageMax: data.range[1],
			sexOrient: data.sexOrient,
			localisation: data.localisation,
            tags: data.tags,
        })
        .then((response) => {
			console.log(response.data)
          return (response.data.payload);
        })
        .catch(error => {
			console.log(error)
          return (false);
        })
	}
	
	render () {
		return (
			<Form 
				popup={this.togglePopup.bind(this)}
				handleChange={this.handleChange.bind(this)}
				passwordStrength={this.passwordStrength.bind(this)}
				nextStep={this.nextStep.bind(this)}
				previousStep={this.previousStep.bind(this)}
				handleRange={this.handleRange.bind(this)}
				handleSlider={this.handleSlider.bind(this)}
				handleAddition={this.handleAddition.bind(this)}
				handleDelete={this.handleDelete.bind(this)}
				submit={this.submit.bind(this)}
				{...this.state}
			/>
		);
	}
}

export default SignUp;
