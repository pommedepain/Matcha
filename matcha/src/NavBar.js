import React from 'react'
import './NavBar.css'
import LogBar from './LogBar'

const NavBar = () => {
	return (
		<div className="NavBar">
			<h1 className="logo"><i className="fas fa-puzzle-piece" /> Matcha</h1>
			<LogBar />
		</div>
	)
};

export default NavBar;
