import React from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import PasswdStrength from './utils/PasswdStrength'
import Tags from './utils/Tags'
import classes from './SignUp.module.css';
import AlertBox from './utils/AlertBox'

// const Slider = require('rc-slider');
// const createSliderWithTooltip = Slider.createSliderWithTooltip;
// const Range = createSliderWithTooltip(Slider.Range);

const SignUp = (props) => {
	return (
		<div>
			<div className={classes.display_page} id="display_page" style={props.style}>
				<h2>Matchez, Discutez<br />Faites des rencontres.</h2>
				<button className={classes.sign_up} onClick={props.popup}>Sign Up</button>
			</div>
			{props.showPopup ?  
			<div className={classes.popup}>
				<div className={classes.popup_inner}>
					<form id={classes.msform}>
						{props.showAlert ? 
						<AlertBox 
							message="Please choose a Tag amongst the suggestions"
							button="Try Again"
							handleChange={props.handleChange}
						/>
						: null}
						<button type="button" onClick={props.popup} className={`${classes.close} ${classes.heavy} ${classes.rounded}`}></button>
						<ul id={classes.progressbar}>
							<li className={classes.active}>Account Setup</li>
							<li>Personal Details</li>
							<li>Preferences</li>
						</ul>
						<fieldset>
							<h2 className={classes.fs_title}>Create your account</h2>
							<h3 className={classes.fs_subtitle}>This is step 1</h3>
							<input 
								type="text" 
								name="firstName" 
								placeholder="First Name"
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
								style={{marginBottom: '0'}}
								placeholder="Password"
								password={props.password}
								score={props.score} 
								strengthMeter={props.passwordStrength}
							/>
							<PasswdStrength 
								name="cPasswd"
								style={{marginBottom: '0'}}
								placeholder="Confirm Password"
								password={props.cPasswd} 
								score={props.score2} 
								strengthMeter={props.passwordStrength}
							/>
							<input 
								type="button" 
								name="next" 
								className={`${classes.next} ${classes.action_button}`} 
								value="Next" 
								onClick={props.nextStep} 
							/>
						</fieldset>
						<fieldset>
							<h2 className={classes.fs_title}>Tell us more about yourself</h2>
							<h3 className={classes.fs_subtitle}>Who are you ?</h3>
							<h3 className={classes.questions}>Birthdate</h3>
							<input
								type="date"
								id={classes.birthdate}
								value={props.birthdate}
								name="birthdate"
								onChange={props.handleChange}
							/>
							<h3 className={classes.questions}>Gender</h3>
							<div className={classes.genderGroup}>
								<input
									id="male"
									type="radio"
									value="male"
									name="gender"
									checked={props.gender === "male"}
									onChange={props.handleChange}
								/>
								<label htmlFor="male">Male</label>
								<input
									id="female"
									type="radio"
									value="female"
									name="gender"
									checked={props.gender === "female"}
									onChange={props.handleChange}
								/>
								<label htmlFor="female">Female</label>
								<input
									id="genderqueer"
									type="radio"
									value="genderqueer"
									name="gender"
									checked={props.gender === "genderqueer"}
									onChange={props.handleChange}
								/>
								<label htmlFor="genderqueer">Genderqueer</label>
							</div>
							<h3 className={classes.questions}>Sexual Orientation</h3>
							<div id={classes.sexualOrient}>
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
							<h3 className={classes.questions}>Bio</h3>
							<textarea
								value={props.bio}
								name="bio"
								onChange={props.handleChange}
							></textarea>
							<input 
								type="button" 
								name="previous" 
								className={`${classes.previous} ${classes.action_button}`} 
								value="Previous" 
								onClick={props.previousStep}
							/>
							<input 
								type="button" 
								name="next" 
								className={`${classes.next} ${classes.action_button}`} 
								value="Next"
								onClick={props.nextStep}
							/>
							{/* <input 
								type="button" 
								name="next" 
								className={classes.skip} 
								value="Skip"
								onClick={props.nextStep}
							/> */}
						</fieldset>
						<fieldset>
							<h2 className={classes.fs_title}>What are you looking for?</h2>
							<h3 className={classes.fs_subtitle}>This will improve our algorithm</h3>
							<div className={classes.step3}>
								<h3 className={classes.questionsS3}>Age Range</h3>
								<h4 className={classes.values}>{props.range[0]} - {props.range[1]}</h4>
								<Range
									min={18}
									max={100}
									defaultValue={[18, 25]}
									// value={props.range}
									count={1}
									pushable={true}
									onChange={props.handleRange}
								/>
							</div>
							<div className={classes.step3}>
								<h3 className={classes.questionsS3}>Maximum Distance</h3>
								<h4 className={classes.values}>{props.localisation}km</h4>
								<Slider
									min={3}
									max={160}
									defaultValue={5}
									// value={props.localisation}
									count={1}
									onChange={props.handleSlider}
								/>
							</div>
								<Tags
									divclassname={classes.step3}
									h3classname={classes.questionsS3}
									tags={props.tags}
									handleDelete={props.handleDelete}
									handleAddition={props.handleAddition}
								/>
							<input 
								type="button" 
								name="previous" 
								className={`${classes.previous} ${classes.action_button}`} 
								value="Previous"
								onClick={props.previousStep}
							/>
							<input 
								type="submit" 
								name="submit" 
								className={`${classes.submit} ${classes.action_button}`} 
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
