import React from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import PasswdStrength from './utils/PasswdStrength'
import Tags from './utils/Tags'

// const Slider = require('rc-slider');
// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);

const SignUp = (props) => {
	return (
		<div>
			<div className="display_page" id="display_page" style={props.style}>
				<h2>Matchez, Discutez<br />Faites des rencontres.</h2>
				<button className="sign_up" onClick={props.popup}>Sign Up</button>
			</div>
			{props.showPopup ?  
			<div className="popup">
				<div className="popup_inner">
					<form id="msform">
						<button type="button" onClick={props.popup} className="close heavy rounded"></button>
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
								value={props.firstName}
								onChange={props.handleChange}
							/>
							<input 
								type="text" 
								name="lastName" 
								placeholder="Last Name"
								value={props.lastName}
								onChange={props.handleChange}
							/>
							<input 
								type="text" 
								name="username" 
								placeholder="Username"
								value={props.username}
								onChange={props.handleChange}
							/>
							<input
								type="text" 
								name="email" 
								placeholder="Email"
								value={props.email}
								onChange={props.handleChange}
							/>
							<PasswdStrength 
								name="password"
								placeholder="Password"
								password={props.password}
								score={props.score} 
								strengthMeter={props.passwordStrength}
							/>
							<PasswdStrength 
								name="cPasswd" 
								placeholder="Confirm Password"
								password={props.cPasswd} 
								score={props.score2} 
								strengthMeter={props.passwordStrength}
							/>
							<input 
								type="button" 
								name="next" 
								className="next action-button" 
								value="Next" 
								onClick={props.nextStep} 
							/>
						</fieldset>
						<fieldset>
							<h2 className="fs-title">Tell us more about yourself</h2>
							<h3 className="fs-subtitle">Who are you ?</h3>
							<h3 className="questions">Birthdate</h3>
							<input
								type="date"
								id="birthdate"
								value={props.birthdate}
								name="birthdate"
								onChange={props.handleChange}
							/>
							<h3 className="questions">Gender</h3>
							<div className="genderGroup">
								<input
									className="gender"
									id="male"
									type="radio"
									value="male"
									name="gender"
									checked={props.gender === "male"}
									onChange={props.handleChange}
								/>
								<label htmlFor="male">Male</label>
								<input
									className="gender"
									id="female"
									type="radio"
									value="female"
									name="gender"
									checked={props.gender === "female"}
									onChange={props.handleChange}
								/>
								<label htmlFor="female">Female</label>
								<input
									className="gender"
									id="genderqueer"
									type="radio"
									value="genderqueer"
									name="gender"
									checked={props.gender === "genderqueer"}
									onChange={props.handleChange}
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
									checked={props.sexOrient === "hetero"}
									onChange={props.handleChange}
								/>
								<label htmlFor="hetero">Heterosexual</label>
								<input
									id="homo"
									type="radio"
									value="homo"
									name="sexOrient"
									checked={props.sexOrient === "homo"}
									onChange={props.handleChange}
								/>
								<label htmlFor="homo">Homosexual</label>
								<input
									id="bi"
									type="radio"
									value="bi"
									name="sexOrient"
									checked={props.sexOrient === "bi"}
									onChange={props.handleChange}
								/>
								<label htmlFor="bi">Bisexual</label>
								<input
									id="pan"
									type="radio"
									value="pan"
									name="sexOrient"
									checked={props.sexOrient === "pan"}
									onChange={props.handleChange}
								/>
								<label htmlFor="pan">Pansexual</label>
							</div>
							<h3 className="questions">Bio</h3>
							<textarea
								value={props.bio}
								name="bio"
								onChange={props.handleChange}
							></textarea>
							<input 
								type="button" 
								name="previous" 
								className="previous action-button" 
								value="Previous" 
								onClick={props.previousStep}
							/>
							<input 
								type="button" 
								name="next" 
								className="next action-button" 
								value="Next"
								onClick={props.nextStep}
							/>
							{/* <input 
								type="button" 
								name="next" 
								className="skip" 
								value="Skip"
								onClick={props.nextStep}
							/> */}
						</fieldset>
						<fieldset>
							<h2 className="fs-title">What are you looking for?</h2>
							<h3 className="fs-subtitle">This will improve our algorithm</h3>
							<div className="step3">
								<h3 className="questionsS3">Age Range</h3>
								<h4 className="values">{props.range[0]} - {props.range[1]}</h4>
								<Range
									min={18}
									max={100}
									defaultValue={[18, 25]}
									value={props.range}
									count={1}
									pushable={true}
									onChange={props.handleRange}
								/>
							</div>
							<div className="step3">
								<h3 className="questionsS3">Maximum Distance</h3>
								<h4 className="values">{props.localisation}km</h4>
								<Slider
									min={3}
									max={160}
									defaultValue={5}
									value={props.localisation}
									count={1}
									onChange={props.handleSlider}
								/>
							</div>
								<Tags
									divclassname="step3"
									h3classname="questionsS3"
									tags={props.tags}
									handleDelete={props.handleDelete}
									handleAddition={props.handleAddition}
								/>
							<input 
								type="button" 
								name="previous" 
								className="previous action-button" 
								value="Previous"
								onClick={props.previousStep}
							/>
							<input 
								type="submit" 
								name="submit" 
								className="submit action-button" 
								value="Submit" 
								onClick={props.submit}
							/>
						</fieldset>
					</form>
				</div>
			</div>
			: null }  
		</div>
	);
}

export default SignUp;
