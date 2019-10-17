import React, { Component } from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import classes from './Home.module.css';
import { UserContext } from '../../Contexts/UserContext';
import Tags from '../Utils/Tags/Tags';

// const axios = require('axios');
const TagDatas = require('../../Datas/tagSuggestions.json');

class Home extends Component {
	constructor (props) {
		super(props);
		this.state = {
			ageRange: [18, 25],
			ageRangeTouched: false,
			scoreRange: [50, 100],
			scoreRangeTouched: false,
			localisation: 5,
			sliderTouched: false,
			tags: [
				{ id: "athlete", text: "Athlete" },
				{ id: "geek", text: "Geek" }
			],
			touched: false,
		}
	}

	static contextType = UserContext;

	handleSlider = (newValue) => {
		this.setState({
			localisation: newValue,
			sliderTouched: true
		})
	}

	handleAgeRange = (newValue) => {
		this.setState({
			ageRange: newValue,
			ageRangeTouched: true
		})
	}

	handleScoreRange = (newValue) => {
		this.setState({
			scoreRange: newValue,
			scoreRangeTouched: true
		})
	}

	handleDelete = (i) => {
		const { tags } = this.state
		this.setState({
			touched: true,
			tags: tags.filter((tag, index) => index !== i),
		})
	}

	handleAddition = (tag) => {
		for (let i = 0; i < TagDatas.suggestions.length; i++)
		{
			if (TagDatas.suggestions[i].text === tag.text)
			{
				return (this.setState(
					state => ({ 
						tags: [...state.tags, tag],
						touched: true })
				));
			}
		}
		return (
			this.setState(
				{ showAlert: true }
			)
		)
	}

	render() {
		return (
			<div className={classes.main}>
				<div className={classes.filters}>
					<h3>Filters</h3>
					<div className={classes.border}>
						<div className={classes.step3}>
							<h3 className={classes.questionsS3}>Age Range</h3>
							<h4 className={classes.values}>{this.state.ageRange[0]} - {this.state.ageRange[1]}</h4>
							<Range
								min={18}
								max={100}
								defaultValue={[18, 25]}
								count={1}
								pushable={true}
								onChange={this.handleAgeRange.bind(this)}
							/>
						</div>
						<div className={classes.step3}>
							<h3 className={classes.questionsS3}>Maximum Distance</h3>
							<h4 className={classes.values}>{this.state.localisation}km</h4>
							<Slider
								min={3}
								max={160}
								defaultValue={5}
								count={1}
								onChange={this.handleSlider.bind(this)}
							/>
						</div>
						<div className={classes.step3}>
							<h3 className={classes.questionsS3}>Scoring</h3>
							<h4 className={classes.values}>{this.state.scoreRange[0]}% - {this.state.scoreRange[1]}%</h4>
							<Range
								min={0}
								max={100}
								defaultValue={[50, 100]}
								count={5}
								pushable={true}
								onChange={this.handleScoreRange.bind(this)}
							/>
						</div>
						<Tags
							title="Tags"
							style={true}
							divclassname={classes.step3}
							h3classname={classes.questionsS3}
							tags={this.state.tags}
							handleDelete={this.handleDelete.bind(this)}
							handleAddition={this.handleAddition.bind(this)}
						/>
					</div>
				</div>
			</div>
		)
	}
}

export default Home;
