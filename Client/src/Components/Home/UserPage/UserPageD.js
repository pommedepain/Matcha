import React from 'react';
import cx from 'classnames';

import classes from './UserPage.module.css';
import Hashtag from '../../../Icons/hashtag';
import AlertBox from '../../Utils/AlertBox/AlertBox';

const UserPageDumb = (props) => {
	let genderIcon = null;
	if (props.user.gender === "male") {
		genderIcon = "fas fa-mars";
	}
	else if (props.user.gender === "female") {
		genderIcon = "fas fa-venus";
	}
	else if (props.user.gender === "queer") {
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

	let gender = null;
	if (props.user.gender === "male") {
		gender = "Male";
	}
	else if (props.user.gender === "female") {
		gender = "Female";
	}
	else if (props.user.gender === "genderQueer") {
		gender = "Queer";
	}

	const handleClickOutside = (e) => {
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

	// console.log(props);
	return (
		<div className={cx(classes.underDiv, "underDiv")} onClick={handleClickOutside} id={props.id}>
			{props.alertBox ?
				<AlertBox
					message={props.alertBox.message}
					button={props.alertBox.button}
					handleChange={props.handleChange}
					color={props.alertBox.color}
					function={true}
					logIn={true}
					style={{position: 'fixed', top: '65%'}}
				/>
				: null
			}
			<div className={cx(classes.bubble, "back", classes.back)} id={props.id}>
				<div className={classes.left}>
					<div className={classes.leftTopGroup} >
						<div className={classes.photos}>
							{props.user.photos ?
								props.user.photos.map((elem, i) => (
									i === 0 ?
									<i key={i} id={i} className={"profilPicFront"} ><img className={classes.profilPicFront} src={elem} alt="profil" key={i} /></i>
									: <i key={i} id={i} className={"profilPicBack"} ><img className={classes.profilPicBack} src={elem} alt="profil" key={i} /></i>
								))
								: <i className={cx(classes.profilPicFront, "fas fa-user-circle", classes.icon)} id={0} ></i> 
							}
						</div>
						<div className={classes.dotGroup}>
							{props.user.photos ?
								props.user.photos.map((elem, i) => {
									console.log(i);
									if (i === 0 && props.user.photos[1]) {
										return (<div 
													className={cx(classes.dotFront, classes.dot, "dot", "dotFront")} 
													key={i} 
													id={i} 
													onClick={(event) => props.handleNextPic(event, i)}
												></div>);
									}
									else if (i === 0 && !props.user.photos[1]) {
										return (null);
									}
									else { 
										return (<div 
													className={cx(classes.dotBack, classes.dot, "dot", "dotBack")} 
													key={i} 
													id={i}
													onClick={(event) => props.handleNextPic(event, i)}
												></div>);
								}})
								: null
							}
						</div>
						<div className={classes.statusGroup}>
							{props.user.online ?
								<div className={cx(classes.active, classes.statusCircle)}></div>
								: <div className={cx(classes.inactive, classes.statusCircle)}></div>
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
							<h4 className={classes.usernameAge}>{props.user.username}, {props.user.age} yo</h4>
							<h4 className={classes.genderSex}><i className={cx(genderIcon, classes.genderIcon)}></i>{gender}, {sexOrient}</h4>
						</div>
						<div className={classes.heartGroup}>
							{props.user.Uliked ? 
								<i className={cx(classes.empty_heart, "fas fa-heart", "empty_heart")} id={props.id} onClick={props.handleHeartClick} ></i>
								: <i className={cx(classes.empty_heart, "far fa-heart", "empty_heart")} id={props.id} onClick={props.handleHeartClick} ></i>
							}
							{props.user.likedU ?
								<h6>{props.user.username} liked you!</h6>
								: null
							}
						</div>
					</div>
					<div className={classes.rightMiddle}>
						<i className={cx("fas fa-quote-left", classes.left_quote)}></i>
						<div className={classes.bioCont}>
							<div className={classes.IAm}>
								<h5>I am...</h5>
								<div className={classes.tagContIAm}>
									{props.user.isTags.map((elem, i) => (
										<span key={i} className={classes.price_tag}>
											<Hashtag className={classes.hash}/> 
											{elem.text}
										</span>
									))}
								</div>
							</div>
							<div className={classes.bio}>
								<h4>{props.user.bio}</h4>
							</div>
							<div className={classes.lookingFor}>
								<h5>I'm interested In...</h5>
								<div className={classes.tagContInterest}>
									{props.user.isTags.map((elem, i) => (
										<span key={i} className={classes.price_tag}>
											<Hashtag className={classes.hash}/> 
											{elem.text}
										</span>
									))}
								</div>
							</div>
						</div>
						<i className={cx("fas fa-quote-right", classes.right_quote)}></i>
					</div>
					<div className={classes.rightBottom}>
						<div className={classes.problemsCont}>
							<div className={classes.block}>
								<i className="fas fa-user-slash"></i>
								<h5>Block</h5>
							</div>
							<div className={classes.fake}>
								<i className="fas fa-bullhorn"></i>
								<h5>Fake</h5>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserPageDumb;
