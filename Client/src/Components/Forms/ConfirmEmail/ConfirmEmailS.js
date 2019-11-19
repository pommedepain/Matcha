import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import ConfirmEmailDummy from './ConfirmEmailD';

const axios = require('axios');

class ConfirmEmailSmart extends Component {
	constructor (props) {
		super(props);
		this.state = {
			loading: false,
			wrongLink: false
		};
	}

	componentDidMount () {
		axios.get(`http://localhost:4000/API/users/confirm/${this.props.match.params.username}/${this.props.match.params.token}`)
			.then(res => {
				console.log(res);
				this.setState({ loading: false });
				if (res.data.success) {
					console.log("Email confirmed!");
					this.setState({ wrongLink: false });
				} else this.setState({ wrongLink: true });
			})
			.catch(error => {
				this.setState({ 
					loading: false,
					wrongLink: true
				});
				console.log(error);
			})
	}
	
	render () {
		return (
			<ConfirmEmailDummy
				{...this.state}
			/>
		)
	}
}

export default withRouter(ConfirmEmailSmart);
