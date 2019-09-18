import React from 'react';
import cx from 'classnames';

import classes from './LogIn.module.css';
import Input from '../../Utils/Input/Input'

const LogIn = (props) => {
	return (
		<div>
			{props.showPopup ?
			<div className={classes.popup}>
				<div className={classes.popup_inner}>
					<form id={classes.msform}>
						<button type="button" onClick={props.popup} className={cx(classes.close, classes.heavy, classes.rounded)}></button>
						<fieldset>
							<h2 className={classes.fs_title}>Log In</h2>
							<h3 className={classes.fs_subtitle}>And see what you missed</h3>
							<Input
								type="text" 
								inputtype="input"
								name="username" 
								placeholder="Pseudo"
								value={props.username}
								onChange={props.handleChange}
								required
							/>
							<Input
								type={props.hidden ? "password" : "text"}
								inputtype="input"
								name="password" 
								placeholder="Password"
								value={props.password}
								onChange={props.handleChange}
								required
							/>
							<span
								className={classes.passwdToggle}
								onClick={props.toggleShow}
							>{props.hidden ? "Show" : "Hide"}</span>
							<input 
								type="submit" 
								name="submit" 
								className={cx(classes.submit, classes.action_button)} 
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
