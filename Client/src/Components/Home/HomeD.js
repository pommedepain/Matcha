import React from 'react';
// import cx from 'classnames';

import classes from './Home.module.css';
import UserIcon from './UserIcon/UserIcon';
import UserPage from './UserPage/UserPageS';
import MapContainer from '../Geolocalisation/MapContainer';

const HomeDumb = (props) => {
	// console.log(props);
	return (
		<div>
			<div className={classes.main} id="main" >
				<div className={classes.geolocCont} >
					<MapContainer displayInput={props.displayInput} suggestions={props.suggestions} photo={props.JWT.data.photos[0]}/>
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
