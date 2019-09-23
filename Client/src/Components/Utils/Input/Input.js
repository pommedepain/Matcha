import React from 'react'

import classes from './Input.module.css'

const input = (props) => {
	let inputElement = null;

	switch (props.elementType) {
		case ( 'input') :
			inputElement = <input 
				className={classes.inputElement} 
				{...props.elementConfig}
				value={props.value}
				onChange={props.inputChangedHandler} />;
			break;
		case ( 'textarea' ):
			inputElement = <textarea 
				className={classes.inputElement} 
				{...props.elementConfig}
				value={props.value}
				onChange={props.inputChangedHandler} />;
			break;
		case ( 'select' ):
			/* Dans le SmartComponent, le contenu de "state.elementConfig:" 
			devra être remplacé par "options: [{value: '', displayValue:''}]" */
			inputElement = (
				<select 
					className={classes.inputElement}
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
				className={classes.inputElement} 
				{...props.elementConfig}
				value={props.value}
				onChange={props.inputChangedHandler} />;
	}

	return (
		<div className={classes.Input}>
			{props.label ?
			<label className={classes.label}>{props.label}</label>
			: null }
			{inputElement}
		</div>
	)
};

export default input;
