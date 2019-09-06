import React from 'react'
import './MemeGenerator.css'

class MemeGenerator extends React.Component {
	constructor() {
		super()
		this.state = {
			topText: "",
			bottomText: "",
			randImg: "http://i.imgflip.com/1bij.jpg",
			allMemeImgs: ""
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleGen = this.handleGen.bind(this)
	}
	
	componentDidMount() {
		this.setState({loading: true})
		fetch("https://api.imgflip.com/get_memes")
			.then(response => response.json())
			.then(response => {
				const {memes} = response.data
				this.setState({
					allMemeImgs: memes
				})
			})
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
	}

	handleGen(event) {
		event.preventDefault()
		this.setState({
			randImg: this.state.allMemeImgs[Math.floor(Math.random()*this.state.allMemeImgs.length)].url
		})
	}

	render() {
		return (
			<div>
				<form className="meme-form">
					<input 
						type="text"
						name="topText"
						placeholder="Top Text"
						value={this.state.topText}
						onChange={this.handleChange}
					/>
					<input
						type="text"
						name="bottomText"
						placeholder="Bottom Text"
						value={this.state.bottomText}
						onChange={this.handleChange}
					/>
					<button type="button" onClick={this.handleGen}>Gen</button>
				</form>
				<div className="meme">
					<img src={this.state.randImg} alt="random meme"/>
					<h2 className="top">{this.state.topText}</h2>
					<h2 className="bottom">{this.state.bottomText}</h2>
				</div>
			</div>
		)
	}
}

export default MemeGenerator
