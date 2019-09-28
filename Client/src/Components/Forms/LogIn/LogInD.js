import React from 'react';
import cx from 'classnames';

import classes from './LogIn.module.css';
import Input from '../../Utils/Input/Input'

const LogIn = (props) => {
	let formElementsArray = [];

	// eslint-disable-next-line no-unused-vars
	for (let key in props.orderForm) {
		formElementsArray.push({
			id: key,
			config: props.orderForm[key]
		});
	}

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
								key={formElementsArray[0].id}
								elementType={formElementsArray[0].config.elementType}
								elementConfig={formElementsArray[0].config.elementConfig}
								value={formElementsArray[0].config.value}
								changed={(event) => props.inputChangedHandler(event, formElementsArray[0].id)}
								invalid={!formElementsArray[0].config.valid}
								shouldValidate={formElementsArray[0].config.validation}
								touched={formElementsArray[0].config.touched}
								errorMessage="Must be at least 3 characters long and contain only letters."
							/>
							<div className={classes.passwdCont}>
								<Input
									key={formElementsArray[1].id}
									elementType={formElementsArray[1].config.elementType}
									elementConfig={formElementsArray[1].config.elementConfig}
									value={formElementsArray[1].config.value}
									changed={(event) => props.inputChangedHandler(event, formElementsArray[1].id)}
									invalid={!formElementsArray[1].config.valid}
									shouldValidate={formElementsArray[1].config.validation}
									touched={formElementsArray[1].config.touched}
									errorMessage="Must be at least 7 characters long and contain 1 lowercase, 1 uppercase, 1 number and 1 special character."
								/>
								<span
									className={classes.passwdToggle}
									onClick={(event) => props.toggleShow(event, formElementsArray[1].id)}
								>{props.hidden ? "Show" : "Hide"}</span>
							</div>
							<input 
								type="submit" 
								name="submit" 
								className={cx(classes.submit, classes.action_button)} 
								value="Submit" 
								onClick={props.submit}
								disabled={!props.formIsValid}
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