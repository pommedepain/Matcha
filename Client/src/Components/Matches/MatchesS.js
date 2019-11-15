import React, { Component } from 'react';
import axios from 'axios';

import MatchesDummy from './MatchesD';
import { UserContext } from '../../Contexts/UserContext';

class MatchesSmart extends Component {
	state = {

	};

	static contextType = UserContext;

	render () {
		return (
			<MatchesDummy
				{...this.state}
				{...this.context}
			/>
		)
	}
}

export default MatchesSmart;
