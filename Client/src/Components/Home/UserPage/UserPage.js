import React from 'react';
import cx from 'classnames';

import classes from './UserPage.module.css';
import Hashtag from '../UserIcon/hashtag';

const UserPage = (props) => {
	let genderIcon = null;
	if (props.user.gender === "male") {
		genderIcon = "fas fa-mars";
	}
	else if  (props.user.gender === "female") {
		genderIcon = "fas fa-venus";
	}
	else if  (props.user.gender === "queer") {
		genderIcon = "fas fa-transgender";
	}
	let sexOrient = null;
	if (props.user.sexOrient === "bi") {
		sexOrient = "Bisexual";
	}
	else if (props.user.sexOrient === "hetero") {
		sexOrient = "Heterosexual";
	}
	else if (props.user.sexOrient === "pan") {
		sexOrient = "Pansexual";
	}

	function handleClickOutside (e) {
		e.preventDefault();
		if (e.target.classList.contains("underDiv")) {
			const id = e.target.id;
			const users = document.querySelectorAll('.back');
			const underDiv = document.querySelectorAll('.underDiv');
			users[id].style.display = "none";
			underDiv[id].style.display = "none";
			document.getElementById("main").style.filter = 'blur(0)'
		}
	}

	console.log(props.user);
	return (
		<div className={cx(classes.underDiv, "underDiv")} onClick={handleClickOutside} id={props.id}>
			<div className={cx(classes.bubble, "back", classes.back)} id={props.id}>
				{props.user.photos ?
					[props.user.photos.map((elem, i) => <img key={i} className={classes.profilPic} src={elem} alt="profil" />)]
					: <i className={cx(classes.icon, "fas fa-user-circle")}></i> 
				}
				<h3 className={classes.username}><i className={genderIcon}></i> {props.user.username}</h3>
				<h4 className={classes.sexOrient}>{sexOrient}</h4>
				<h4 className={classes.age}>{props.user.age}</h4>
				<hr className={classes.ligne} data-content="tags" />
				<div className={classes.tagCont} id="tagCont">
					{props.user.isTags.map((elem, i) => (
						<span key={i} className={classes.price_tag}>
							<Hashtag className={classes.hash}/> 
							{elem.text}
						</span>
					))}
				</div>
			</div>
		</div>
	)
}

export default UserPage;
