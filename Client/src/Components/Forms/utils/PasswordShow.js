import React from 'react';
import './PasswordShow.css';

const PasswordShow = (props) => {
	
	toggleShow = (event) => {
		event.preventDefault()
		props.setState({ hidden: !props.hidden })
	}

	return (
		<span
			className="passwdButton"
			onClick={this.toggleShow.bind(this)}
		>{props.hidden ? "Show" : "Hide"}</span>
	)
}

export default PasswordShow
