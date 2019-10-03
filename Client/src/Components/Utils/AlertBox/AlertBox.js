import React from 'react'
import classes from './AlertBox.module.css'

const AlertBox = (props) => {
	return (
		props.color === "red" ?
		<div id={classes.error_box}>
			<div className={classes.dot}></div>
			<div className={`${classes.dot} ${classes.two}`}></div>
			<div className={classes.face2}>
				<div className={classes.eye}></div>
				<div className={`${classes.eye} ${classes.right}`}></div>
				<div className={`${classes.mouth} ${classes.sad}`}></div>
			</div>
			<div className={`${classes.shadow} ${classes.move}`}></div>
			<div className={classes.message}>
				<h1 className={`${classes.alert} ${classes.h1}`}>Error!</h1>
				<p className={classes.p}>{props.message}</p>
			</div>
			<button 
				className={`${classes.button_box} ${classes.button}`}
				onClick={props.handleChange}
			>
				<h1 className={classes.red}>{props.button}</h1>
			</button>
		</div>
		:
		<div id={classes.success_box}>
			<div className={classes.dot}></div>
			<div className={`${classes.dot} ${classes.two}`}></div>
			<div className={classes.face}>
				<div className={classes.eye}></div>
				<div className={`${classes.eye} ${classes.right}`}></div>
				<div className={`${classes.mouth} ${classes.happy}`}></div>
			</div>
			<div className={`${classes.shadow} ${classes.scale}`}></div>
			<div className={classes.message}>
				<h1 className={`${classes.alert} ${classes.h1}`}>Success!</h1>
				<p className={classes.p}>{props.message}</p>
			</div>
			<button 
				className={`${classes.button_box} ${classes.button}`}
				onClick={props.handleChange}
			>
				<h1 className={classes.red}>{props.button}</h1>
			</button>
		</div>
	)
}

export default AlertBox
