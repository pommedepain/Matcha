import React from 'react'
import classes from './PasswdStrength.module.css'

class PasswdStrength extends React.Component {
	state = {
		hidden: true
	}

	toggleShow = (event) => {
		event.preventDefault()
		this.setState({ hidden: !this.state.hidden })
	}

	render() {
		return (
			<div id={classes.passwd_cont}>
				<input
					style={this.props.style || ''}
					className={classes.passwd}
					type={this.state.hidden ? "password" : "text"}
					name={this.props.name} 
					placeholder={this.props.placeholder}
					value={this.props.password || ''}
					onChange={this.props.strengthMeter}
				/>
				<span
					className={classes.passwdButton}
					onClick={this.toggleShow.bind(this)}
				>{this.state.hidden ? "Show" : "Hide"}</span>
				<span
					className={classes.passwdStrength}
					data-score={this.props.score}
				></span>
			</div>
		)
	}
}

export default PasswdStrength
