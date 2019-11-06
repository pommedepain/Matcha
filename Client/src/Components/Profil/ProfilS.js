import React, { Component } from 'react';

import { UserContext } from '../../Contexts/UserContext';
import ProfilDummy from './ProfilD';
import axios from 'axios';

class Profil extends Component {
	state = {

	};

	static contextType = UserContext;

	render () {
		return (
			<ProfilDummy
				{...this.state}
			/>
		)
	}
}

export default Profil;
