import React, { Component } from 'react';
import './Popup.css';
import { WithContext as ReactTags } from 'react-tag-input'

const KeyCodes = {
	comma: 118,
	enter: 13, 
	tab: 9
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

class PopUp extends Component {
	state = {
		pseudo: "",
		firstName: "", 
		lastName: "",
		birthdate: "",
		email: "",
		passwd: "",
		cPasswd: "",
		hidden: true,
		score: "",
		gender: "",
		sexOrient: "",
		bio: "",
		range: [18, 25],
		tags: [
			{ id: "athlete", text: "Athlete" },
			{ id: "geek", text: "Geek" }
		],
		suggestions: [
			{ id: "cinema", text: "Cinema Lover" },
			{ id: "traveler", text: "Traveler" },
			{ id: "cat", text: "Cat Person" },
			{ id: "dog", text: "Dog Person" },
			{ id: "nature", text: "Nature Lover" },
			{ id: "family", text: "Family-Oriented" },
			{ id: "party", text: "Party Animal" },
			{ id: "book", text: "Bookworm" },
			{ id: "extrovert", text: "Extrovert" },
			{ id: "introvert", text: "Introvert" },
			{ id: "creative", text: "Creative" },
			{ id: "animal", text: "Animal Lover" },
			{ id: "arts", text: "Patron of the Arts" },
		]
	}

	handleChange = (event) => {
		const {name, value, checked, type} = event.target
		type === "checkbox" ?
		this.setState({[name]: checked})
		: 
		this.setState({[name]: value})
	}

	toggleShow = (event) => {
		event.preventDefault()
		this.setState({ hidden: !this.state.hidden })
	}

	passwordStrength = (event) => {
		var zxcvbn = require('zxcvbn');
		event.preventDefault()
		let value = zxcvbn(event.target.value)
		event.target.value === "" ?
		this.setState({ 
			score: null,
			passwd: null
		})
		:
		this.setState({ 
			score: value.score,
			passwd: event.target.value
		})
	}

	handleDelete = (i) => {
		const { tags } = this.state
		this.setState({
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		this.setState(
			state => ({ tags: [...state.tags, tag] })
		)
	}

	// handleDrag = (tag, currPos, newPos) => {
	// 	const tags = [...this.state.tags]
	// 	const newTags = tags.slice()

	// 	console.log("currPos: " + currPos + ", newPos: " + newPos)
	// 	console.log(tag)
	// 	newTags.splice(currPos, 1)
	// 	newTags.splice(newPos, 0, tag)

	// 	/* re-render */
	// 	this.setState({ tags: newTags })
	// }

	nextStep = (props) => {
		let current_fs, next_fs; //fieldsets
		// let left, opacity, scale; //fieldset properties which we will animate
		// let animating; //flag to prevent quick multi-click glitches
			
		// if(animating) 
		// 	return false;
		// animating = true;
		
		current_fs = props.target.parentElement;
		next_fs = current_fs.nextElementSibling;
		
		// activate next step on progressbar using the index of next_fs
		for (let i = 0; i < document.querySelectorAll('#progressbar li').length; i++)
			if (document.querySelectorAll('#progressbar li')[i].className !== "active")
			{
				document.querySelectorAll('#progressbar li')[i].classList.add("active")
				break;
			}

		//show the next fieldset
		next_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';

	// 	current_fs.animate([
	// 		{opacity: 0}, 
	// 		{step: function(now, mx) {
	// 			//as the opacity of current_fs reduces to 0 - stored in "now"
	// 			//1. scale current_fs down to 80%
	// 			scale = 1 - (1 - now) * 0.2;
	// 			//2. bring next_fs from the right(50%)
	// 			left = (now * 50)+"%";
	// 			//3. increase opacity of next_fs to 1 as it moves in
	// 			opacity = 1 - now;
	// 			current_fs.style = {
	//         		transform: 'scale('+scale+')',
	//         		position: 'absolute'
	//       		};
	// 			next_fs.style = {'left': left, 'opacity': opacity};}
	// 		], 
	// 		{ duration: 800, 
	// 		complete: function(){
	// 			current_fs.style.display = 'none';
	// 			animating = false;
	// 		}, 
	// 		// this comes from the custom easing plugin
	// 		easing: 'ease-in-out'
	// 	});
	}


	previousStep = (props) => {
		let current_fs, previous_fs;

		current_fs = props.target.parentElement;
		previous_fs = current_fs.previousElementSibling;

		for (let i = (document.querySelectorAll('#progressbar li').length - 1); i > 0; i--)
			if (document.querySelectorAll('#progressbar li')[i].className === "active")
			{
				document.querySelectorAll('#progressbar li')[i].classList.remove("active")
				break;
			}

		//show the previous fieldset
		previous_fs.style.display = "block"; 
		
		//hide the current fieldset
		current_fs.style.display = 'none';
	
	// 	//hide the current fieldset with style
	// 	current_fs.animate({opacity: 0}, {
	// 		step: function(now, mx) {
	// 			//as the opacity of current_fs reduces to 0 - stored in "now"
	// 			//1. scale previous_fs from 80% to 100%
	// 			scale = 0.8 + (1 - now) * 0.2;
	// 			//2. take current_fs to the right(50%) - from 0%
	// 			left = ((1-now) * 50)+"%";
	// 			//3. increase opacity of previous_fs to 1 as it moves in
	// 			opacity = 1 - now;
	// 			current_fs.css({'left': left});
	// 			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
	// 		}, 
	// 		duration: 800, 
	// 		complete: function(){
	// 			current_fs.hide();
	// 			animating = false;
	// 		}, 
	// 		//this comes from the custom easing plugin
	// 		easing: 'easeInOutBack'
	// 	});
	// });
	}

	// $(".submit").click(function(){
	// 	return false;
	// });
	
	render() {
		const { tags, suggestions } = this.state
		return (
			<div className="popup">
				<div className="popup_inner">
					<form id="msform">
						<button onClick={this.props.closePopup} className="close heavy rounded"></button>
						<ul id="progressbar">
							<li className="active">Account Setup</li>
							<li>Personal Details</li>
							<li>Preferences</li>
						</ul>
						<fieldset>
							<h2 className="fs-title">Create your account</h2>
							<h3 className="fs-subtitle">This is step 1</h3>
							<input 
								type="text" 
								name="firstName" 
								placeholder="Fist Name"
								value={this.state.firstName}
								onChange={this.handleChange.bind(this)}
							/>
							<input 
								type="text" 
								name="lastName" 
								placeholder="Last Name"
								value={this.state.lastName}
								onChange={this.handleChange.bind(this)}
							/>
							<input 
								type="text" 
								name="pseudo" 
								placeholder="Pseudo"
								value={this.state.pseudo}
								onChange={this.handleChange.bind(this)}
							/>
							<input
								type="text" 
								name="email" 
								placeholder="Email"
								value={this.state.email}
								onChange={this.handleChange.bind(this)}
							/>
							<div id="passwd-cont">
								<input
									className="passwd"
									type={this.state.hidden ? "password" : "text"}
									name="passwd" 
									placeholder="Password"
									value={this.state.passwd}
									onChange={this.passwordStrength.bind(this)}
								/>
								<span
									className="passwdButton"
									onClick={this.toggleShow.bind(this)}
								>{this.state.hidden ? "Show" : "Hide"}</span>
								<span
									className="passwdStrength"
									data-score={this.state.score}
								></span>
							</div>
							<input 
								type={this.state.hidden ? "password" : "text"}
								name="cPasswd" 
								placeholder="Confirm Password"
								value={this.state.cPasswd}
								onChange={this.handleChange.bind(this)}
							/>
							<input 
								type="button" 
								name="next" 
								className="next action-button" 
								value="Next" 
								onClick={this.nextStep.bind(this)} 
							/>
						</fieldset>
						<fieldset>
							<h2 className="fs-title">Tell us more about yourself</h2>
							<h3 className="fs-subtitle">Who are you ?</h3>
							<h3 className="questions">Birthdate</h3>
							<input
								type="date"
								id="birthdate"
								value={this.state.birthdate}
								name="birthdate"
								onChange={this.handleChange.bind(this)}
							/>
							<h3 className="questions">Gender</h3>
							<div className="genderGroup">
								<input
									className="gender"
									id="male"
									type="radio"
									value="male"
									name="gender"
									checked={this.state.gender === "male"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="male">Male</label>
								<input
									className="gender"
									id="female"
									type="radio"
									value="female"
									name="gender"
									checked={this.state.gender === "female"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="female">Female</label>
								<input
									className="gender"
									id="genderqueer"
									type="radio"
									value="genderqueer"
									name="gender"
									checked={this.state.gender === "genderqueer"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="genderqueer">Genderqueer</label>
							</div>
							<h3 className="questions">Sexual Orientation</h3>
							<div id="sexualOrient">
								<input
									id="hetero"
									type="radio"
									value="hetero"
									name="sexOrient"
									checked={this.state.sexOrient === "hetero"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="hetero">Heterosexual</label>
								<input
									id="homo"
									type="radio"
									value="homo"
									name="sexOrient"
									checked={this.state.sexOrient === "homo"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="homo">Homosexual</label>
								<input
									id="bi"
									type="radio"
									value="bi"
									name="sexOrient"
									checked={this.state.sexOrient === "bi"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="bi">Bisexual</label>
								<input
									id="pan"
									type="radio"
									value="pan"
									name="sexOrient"
									checked={this.state.sexOrient === "pan"}
									onChange={this.handleChange.bind(this)}
								/>
								<label htmlFor="pan">Pansexual</label>
							</div>
							<h3 className="questions">Bio</h3>
							<textarea
								value={this.state.bio}
								name="bio"
								onChange={this.handleChange.bind(this)}
							></textarea>
							<input 
								type="button" 
								name="previous" 
								className="previous action-button" 
								value="Previous" 
								onClick={this.previousStep.bind(this)}
							/>
							<input 
								type="button" 
								name="next" 
								className="next action-button" 
								value="Next"
								onClick={this.nextStep.bind(this)}
							/>
							{/* <input 
								type="button" 
								name="next" 
								className="skip" 
								value="Skip"
								onClick={this.nextStep.bind(this)}
							/> */}
						</fieldset>
						<fieldset>
							<h2 className="fs-title">What are you looking for?</h2>
							<h3 className="fs-subtitle">This will improve our algorithm</h3>
							<h3 className="questions">Age Range</h3>
							{/* <ReactDualRangeSlider
								limits={[18, 110]}
								values={this.state.range}
								rangeColor="#0f6"
								onChange={this.handleChange.bind(this)}
							/> */}
							{/* <section className="range-slider">
								<span className="rangeValues"></span>
								<input 
									value={this.state.minRange} 
									min="18" 
									max="110" 
									step="1" 
									type="range"
									onChange={this.handleChange.bind(this)}
								/>
								<input 
									value={this.state.maxRange} 
									min="18" 
									max="110" 
									step="1" 
									type="range"
									onChange={this.handleChange.bind(this)}
								/>
							</section> */}
							<h3 className="questions">What traits do you find most attractive?</h3>
							<ReactTags
								tags={tags}
								suggestions={suggestions}
								handleDelete={this.handleDelete.bind(this)}
								handleAddition={this.handleAddition.bind(this)}
								// handleDrag={this.handleDrag.bind(this)}
								delimiters={delimiters}
								minQueryLength={0}
								inputFieldPosition="top"
								allowDeleteFromEmptyInput={false}
								allowDragDrop={false}
							/>
							<input 
								type="button" 
								name="previous" 
								className="previous action-button" 
								value="Previous"
								onClick={this.previousStep.bind(this)}
							/>
							<input 
								type="submit" 
								name="submit" 
								className="submit action-button" 
								value="Submit" 
								/*onClick={this.submit}*/
							/>
						</fieldset>
					</form>
				</div>
			</div>
		);
	}
}

export default PopUp;
