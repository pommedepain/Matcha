import React from 'react';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import cx from 'classnames';

import classes from './Home.module.css';
import Tags from '../Utils/Tags/Tags';
import UserIcon from './UserIcon/UserIcon';
import UserPage from './UserPage/UserPageS';

const HomeDumb = (props) => {
	const ageRange = props.JWT.data.ageMin ? [props.JWT.data.ageMin, props.JWT.data.ageMax] : props.ageRange;
	const localisation = props.JWT.data.localisation ? props.JWT.data.localisation : props.localisation; 

	// console.log(props);
	return (
		<div>
			<div className={classes.main} id="main" >
				<div className={classes.filters}>
					<h3>Filters</h3>
					<div className={classes.border}>
						<div className={classes.step3}>
							<h3 className={classes.questionsS3}>Age Range</h3>
							<h4 className={classes.values}>{props.ageRange[0]} - {props.ageRange[1]}</h4>
							<Range
								min={18}
								max={100}
								defaultValue={ageRange}
								count={1}
								pushable={true}
								onChange={props.handleAgeRange}
							/>
						</div>
						<div className={classes.step3}>
							<h3 className={classes.questionsS3}>Maximum Distance</h3>
							<h4 className={classes.values}>{props.localisation}km</h4>
							<Slider
								min={3}
								max={160}
								defaultValue={localisation}
								count={1}
								onChange={props.handleSlider}
							/>
						</div>
						<div className={classes.step3}>
							<h3 className={classes.questionsS3}>Popularity</h3>
							<h4 className={classes.values}>{props.popularityRange[0]}% - {props.popularityRange[1]}%</h4>
							<Range
								min={0}
								max={100}
								defaultValue={props.popularityRange}
								count={5}
								pushable={true}
								onChange={props.handlePopularityRange}
							/>
						</div>
						<Tags
							title="Tags"
							styling={true}
							divclassname={classes.step3}
							h3classname={classes.questionsS3}
							tags={props.tags}
							handleDelete={props.handleDelete}
							handleAddition={props.handleAddition}
						/>
						<button onClick={props.submit} className={classes.submit}><i className={cx(classes.angle, "fas fa-angle-right")}></i></button>
					</div>
				</div>
				<div className={classes.wrapper}>
					{props.suggestions !== null ?
						props.suggestions.map((elem, i) => {
							// console.log(i);
							return (<UserIcon 
								{...elem} 
								key={i}
								popupUser={props.popupUser}
								id={i}
							/>)}
						)
						: null
					}
				</div>
			</div>
			{props.suggestions !== null ?
				props.suggestions.map((elem, i) => {
					return(<UserPage 
						{...elem} 
						key={i}
						id={i}
						name="back"
						usersOnline={props.usersOnline}
					/>)}
				)
				: null
			}
		</div>
	)
}

export default HomeDumb;
