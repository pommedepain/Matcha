import React, { Component } from 'react';
import './Popup.css';

class PopUp extends Component {
	state = {
		firstName: "", 
		lastName: "",
		email: "",
		passwd: "",
		confPasswd: ""
	}

	handleChange = (event) => {
		const {name, value} = event.target
		this.setState({
			[name] : value
		})
	} 

	nextStep = (props) => {
		let current_fs, next_fs, previous_fs; //fieldsets
		let left, opacity, scale; //fieldset properties which we will animate
		let animating; //flag to prevent quick multi-click glitches
			
		// if(animating) 
		// 	return false;
		// animating = true;
		
		current_fs = props.target.parentElement;
		console.log(current_fs);
		next_fs = current_fs.nextElementSibling;
		console.log(next_fs);
		
		// activate next step on progressbar using the index of next_fs
		if (document.querySelectorAll('#progressbar li') !== "active")
			document.querySelectorAll('#progressbar li').item("active").nextElementSibling.classList.add("active")
		
		//show the next fieldset
		next_fs.style.display = "block"; 

		current_fs.style.display = 'none';
		//hide the current fieldset with style
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

	// $(".previous").click(function(){
	// 	if(animating) return false;
	// 	animating = true;

	// 	current_fs = $(this).parent();
	// 	previous_fs = $(this).parent().prev();

	// 	//de-activate current step on progressbar
	// 	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	// 	//show the previous fieldset
	// 	previous_fs.show(); 
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

	// $(".submit").click(function(){
	// 	return false;
	// });
	
	render() {
		return (
			<div className="popup">
				<div className="popup_inner">
					<form id="msform">
						<button onClick={this.props.closePopup} className="close heavy rounded"></button>
						<ul id="progressbar">
							<li className="active">Account Setup</li>
							<li>Social Profiles</li>
							<li>Personal Details</li>
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
								name="email" 
								placeholder="Email"
								value={this.state.email}
								onChange={this.handleChange.bind(this)}
							/>
							<input 
								type="password" 
								name="pass" 
								placeholder="Password"
								value={this.state.passwd}
								onChange={this.handleChange.bind(this)}
							/>
							<input 
								type="password" 
								name="cpass" 
								placeholder="Confirm Password"
								value={this.state.confPasswd}
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
							<h2 className="fs-title">Social Profiles</h2>
							<h3 className="fs-subtitle">Your presence on the social network</h3>
							<input 
								type="text" 
								name="twitter" 
								placeholder="Twitter"
							/>
							<input 
								type="text" 
								name="facebook" 
								placeholder="Facebook" 
							/>
							<input 
								type="text" 
								name="gplus" 
								placeholder="Google Plus" 
							/>
							<input type="button" name="previous" className="previous action-button" value="Previous" /*onClick={this.previousStep}*//>
							<input 
								type="button" 
								name="next" 
								className="next action-button" 
								value="Next"
								onClick={this.nextStep.bind(this)}
							/>
						</fieldset>
						<fieldset>
							<h2 className="fs-title">Personal Details</h2>
							<h3 className="fs-subtitle">We will never sell it</h3>
							<input type="text" name="fname" placeholder="First Name" />
							<input type="text" name="lname" placeholder="Last Name" />
							<input type="text" name="phone" placeholder="Phone" />
							<textarea name="address" placeholder="Address"></textarea>
							<input type="button" name="previous" className="previous action-button" value="Previous" />
							<input type="submit" name="submit" className="submit action-button" value="Submit" /*onClick={this.submit}*//>
						</fieldset>
					</form>
				</div>
			</div>
		);
	}
}

export default PopUp;
