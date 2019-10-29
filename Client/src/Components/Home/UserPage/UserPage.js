import React from 'react';
import cx from 'classnames';

import classes from './UserPage.module.css';
import Hashtag from '../../../Icons/hashtag';
import HeartEmpty from '../../../Icons/heart_empty';

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
	// eslint-disable-next-line no-unused-vars
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
				<div className={classes.left}>
					<div className={classes.leftTopGroup} >
						<div className={classes.photos}>
							{props.user.photos ?
								props.user.photos.map((elem, i) => (
									i === 0 ?
									<img className={classes.profilPicFront} src={elem} alt="profil" key={i} />
									: <img className={classes.profilPicBack} src={elem} alt="profil" key={i} />
								))
								: <i className={cx(classes.icon, "fas fa-user-circle")}></i> 
							}
						</div>
						<div className={classes.dotGroup}>
							{props.user.photos ?
								props.user.photos.map((elem, i) => (
									i === 0 ?
									<div className={classes.dotFront} key={i} id={i} ></div>
									: <div className={classes.dotBack} key={i} id={i} ></div>
								))
								: <div className={classes.dotFront} key={0} id={0} ></div>
							}
						</div>
						<div>
							{props.user.active ?
								<div className={classes.active}></div>
								: <div className={classes.inactive}></div>
							}
							<h5 className={classes.status}>Status</h5>
						</div>
					</div>
					<div className={classes.leftBottomGroup}>
						<div className={classes.cercle}>
							<div className={classes.matchIndicator}>
								<h3 className={classes.percentage}>90 <i className="fas fa-percentage"></i></h3>
								<h3 className={classes.popularity}>popularity</h3>
							</div>
						</div>
					</div>
				</div>
				<div className={classes.right}>
					<div className={classes.rightTop}>
						<div className={classes.basicInfos}>
							<h3>{props.user.firstName} {props.user.lastName}</h3>
							<h4>{props.user.username}, {props.user.age} yo</h4>
							<h4>{props.user.gender}, {props.user.sexOrient}</h4>
						</div>
						<div className={classes.heartGroup}>
							<HeartEmpty />
							{props.user ?
								<h6>{props.user.username} liked you!</h6>
								: null
							}
						</div>
					</div>
					<div className={classes.rightMiddle}>
						
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserPage;
