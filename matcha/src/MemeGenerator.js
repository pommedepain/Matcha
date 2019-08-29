import React from 'react'

class MemeGenerator extends React.Component {
	constructor() {
		super()
		this.state = {
			loading: false,
			topText: "",
			bottomText: "",
			randImg: "http://i.imgflip.com/1bij.jpg",
			allMemeImgs: ""
		}
	}
	
	componentDidMount() {
		this.setState({loading: true})
		fetch("https://api.imgflip.com/get_memes")
			.then(response => response.json())
			.then(response => {
				const {memes} = response.data
				console.log(memes[0])
				this.setState({
					allMemeImgs: memes
				})
			})
	}

	render() {
		// const text = this.state.loading ? "Loading..." : this.state.data
		return (
			<div>
				<form className="meme-form">
					<button>Gen</button>
				</form>
			</div>
		)
	}
}

export default MemeGenerator
