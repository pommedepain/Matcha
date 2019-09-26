import React from 'react'

import classes from './Input.module.css'

const input = (props) => {
	let inputElement = null;
	const inputClasses = [classes.inputElement];
	let validationError = null;

	if (props.invalid && props.shouldValidate && props.touched) {
		inputClasses.push(classes.Invalid);
		validationError = <p className={classes.ValidationError}>{props.errorMessage}</p>
	}

	switch (props.elementType) {
		case ( 'input' ) :
			inputElement = <input 
				className={inputClasses.join(' ')} 
				{...props.elementConfig}
				value={props.value}
				onChange={props.inputChangedHandler} />;
			break;
		case ( 'radio' ) :
			inputElement = 
			<div className={inputClasses.join(' ')}>
				{props.elementConfig.options.map(option => (
				<div>
					<input
						key={option.value}
						id={option.id}
						value={option.value}
						checked={props.value}
						onChange={props.inputChangedHandler} 
					/>
					<label htmlFor={option.id}>{option.displayValue}</label>
				</div>
				))}
			</div>;
			break;
		case ( 'textarea' ):
			inputElement = <textarea 
				className={inputClasses.join(' ')} 
				{...props.elementConfig}
				value={props.value}
				onChange={props.inputChangedHandler} />;
			break;
		case ( 'select' ):
			/* Dans le SmartComponent, le contenu de "state.elementConfig:" 
			devra être remplacé par "options: [ {value: '', displayValue:''}, ... ]" */
			inputElement = (
				<select 
					className={inputClasses.join(' ')}
					value={props.value}
					onChange={props.inputChangedHandler} >
					{props.elementConfig.options.map(option => (
						<option key={option.value} value={option.value} >
							{option.displayValue}
						</option>
					))}
				</select>
			);
			break;
		default:
			inputElement = <input 
				className={inputClasses.join(' ')} 
				{...props.elementConfig}
				value={props.value}
				onChange={props.inputChangedHandler} />;
	}

	return (
		<div className={classes.Input}>
			{props.label ?
			<label className={classes.label}>{props.label}</label>
			: null }
			{validationError}
			{inputElement}
		</div>
	)
};

export default input;
