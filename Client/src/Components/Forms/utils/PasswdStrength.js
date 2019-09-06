import React from 'react'
import './PasswdStrength.css'

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
			<div id="passwd-cont">
				<input
					className="passwd"
					type={this.state.hidden ? "password" : "text"}
					name={this.props.name} 
					placeholder={this.props.placeholder}
					value={this.props.password || ''}
					onChange={this.props.strengthMeter}
				/>
				<span
					className="passwdButton"
					onClick={this.toggleShow.bind(this)}
				>{this.state.hidden ? "Show" : "Hide"}</span>
				<span
					className="passwdStrength"
					data-score={this.props.score}
				></span>
			</div>
		)
	}
}

export default PasswdStrength
