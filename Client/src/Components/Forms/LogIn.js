import React from 'react';

import './LogIn.css'

const LogIn = (props) => {
	return (
		<div>
			{props.showPopup ?
			<div className="popup">
				<div className="popup_inner">
					<form id="msform">
						<button type="button" onClick={props.popup} className="close heavy rounded"></button>
						<fieldset>
							<h2 className="fs-title">Log In</h2>
							<h3 className="fs-subtitle">And see what you missed</h3>
							<input 
								type="text" 
								name="username" 
								placeholder="Pseudo"
								value={props.username}
								onChange={props.handleChange}
							/>
							<input 
								type={props.hidden ? "password" : "text"}
								name="password" 
								placeholder="Password"
								value={props.password}
								onChange={props.handleChange}
							/>
							<span
								className="passwdToggle"
								onClick={props.toggleShow}
							>{props.hidden ? "Show" : "Hide"}</span>
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
			:
			null}
		</div>	
	);
}

export default LogIn;
