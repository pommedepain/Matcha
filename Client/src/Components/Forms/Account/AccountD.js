import React from 'react';
import cx from 'classnames';

import classes from './Account.module.css';
import Input from '../../Utils/Input/Input';

const Account = (props) => {
	let formElementsArray = [];

	for (let key in props.orderForm) {
		formElementsArray.push({
			id: key,
			config: props.orderForm[key]
		});
	}

	return (
		<div className={classes.main}>
			<form id={classes.msform}>
				<fieldset>
					<h2 className={classes.fs_title}>Manage your account</h2>
					{formElementsArray.map(formElement => (
						// console.log(formElement),
                		<Input 
                		    key={formElement.id}
                		    elementType={formElement.config.elementType}
                		    elementConfig={formElement.config.elementConfig}
                		    value={formElement.config.value}
                		    invalid={!formElement.config.valid}
                		    shouldValidate={formElement.config.validation}
							touched={formElement.config.touched}
							errorMessage={formElement.config.errorMessage}
							changed={(event) => props.inputChangedHandler(event, formElement.id)}
						/>
					))}
					<input 
						type="submit" 
						name="submit" 
						className={classes.action_button} 
						value="Submit" 
						onClick={props.submit}
						disabled={!props.formIsValid}
					/>
				</fieldset>
			</form>
		</div>
	)
}

export default Account;
