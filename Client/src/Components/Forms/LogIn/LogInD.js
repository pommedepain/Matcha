import React from 'react';
import cx from 'classnames';

import classes from './LogIn.module.css';
import Input from '../../Utils/Input/Input'

const LogIn = (props) => {
let formElementsArray = [];
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
								inputChangedHandler={(event) => props.inputChangedHandler(event, formElementsArray[0].id)}
							/>
							<div className={classes.passwdCont}>
								<Input
									key={formElementsArray[1].id}
									elementType={formElementsArray[1].config.elementType}
									elementConfig={formElementsArray[1].config.elementConfig}
									value={formElementsArray[1].config.value}
									inputChangedHandler={(event) => props.inputChangedHandler(event, formElementsArray[1].id)}
								/>
								<span
									className={classes.passwdToggle}
									onClick={props.toggleShow}
								>{props.hidden ? "Show" : "Hide"}</span>
							</div>
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
