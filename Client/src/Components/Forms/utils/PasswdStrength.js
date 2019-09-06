import React from 'react'
import './PasswdStrength.css'

const PasswdStrength = (props) => {
	return (
		<span
			className="passwdStrength"
			data-score={props.score}
		></span>
	)
}

export default PasswdStrength
