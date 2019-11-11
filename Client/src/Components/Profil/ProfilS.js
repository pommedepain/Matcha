import React, { Component } from 'react';

import { UserContext } from '../../Contexts/UserContext';
import ProfilDummy from './ProfilD';
import axios from 'axios';

class Profil extends Component {
	constructor () {
		super();
		this.state = {
			file: '',
			imagePreviewUrl: ''
		};
	}

	static contextType = UserContext;

	handleSubmit(e) {
		e.preventDefault();
		// TODO: do something with -> this.state.file
		console.log('handle uploading-', this.state.file);
	}
	
	handleImageChange(e) {
		e.preventDefault();
	
		let reader = new FileReader();
		let file = e.target.files[0];
	
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			}, function () {console.log(this.state)});
		}
	
		reader.readAsDataURL(file)
	}

	editProfil = (e) => {
		e.preventDefault();
		console.log("editProfil triggered");
		
	}

	render () {
		console.log(this.context)
		return (
			<ProfilDummy
				handleSubmit={this.handleSubmit.bind(this)}
				handleImageChange={this.handleImageChange.bind(this)}
				editProfil={this.editProfil.bind(this)}
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default Profil;
