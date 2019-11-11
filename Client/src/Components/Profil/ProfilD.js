import React from 'react';
import cx from 'classnames';

import classes from './Profil.module.css';
import Hashtag from '../../Icons/hashtag';

const ProfilDummy = (props) => {
	const user = props.JWT.data;
	let photosArray = [];
	for (let j = 1; j < user.photos.length; j++) {
		photosArray[j] = <img src={user.photos[j]} alt="others" className={classes.otherPic} key={j} />;
	}
	let rest = 5 - photosArray.length;
	if (photosArray.length < 5) {
		let k = photosArray.length;
		for (rest; rest > 0; rest--) {
			photosArray[k++] = <i className={cx(classes.icon, "fas fa-user-circle")} key={k} ></i>;
		}
	}

	let {imagePreviewUrl} = props;
    let imgPreview = null;
    if (imagePreviewUrl) {
      imgPreview = (<img src={imagePreviewUrl} alt="preview"/>);
    } else {
      imgPreview = (<div className={classes.previewText} >Please select an image for preview</div>);
	}
	
	/* Picking the right gender icon to display */
	let genderIcon = null;
	if (user.gender === "male") {
		genderIcon = "fas fa-mars";
	}
	else if (user.gender === "female") {
		genderIcon = "fas fa-venus";
	}
	else if (user.gender === "queer") {
		genderIcon = "fas fa-transgender";
	}

	/* Formatting data for display */
	let sexOrient = null;
	if (user.sexOrient === "bi") {
		sexOrient = "Bisexual";
	}
	else if (user.sexOrient === "hetero") {
		sexOrient = "Heterosexual";
	}
	else if (user.sexOrient === "pan") {
		sexOrient = "Pansexual";
	}

	/* Formatting data for display */
	let gender = null;
	if (user.gender === "male") {
		gender = "Male";
	}
	else if (user.gender === "female") {
		gender = "Female";
	}
	else if (user.gender === "genderQueer") {
		gender = "Queer";
	}

	return (
		<div className={classes.main}>
			<div className={classes.contener} >
				<div className={classes.firstRow}>
					<div className={classes.leftPart}>
						<div className={classes.photosCont}>
							{user.photos[0] ?
								<img src={user.photos[0]} className={classes.profilPic} alt="profil"/>
								: <i className={cx(classes.icon, "fas fa-user-circle")}></i>
							}
							<div className={classes.otherPics}>
								{user.photos ?
									photosArray.map((elem, i) => {
										if (i !== 0) {
											return (elem)
										}
										else return null;
									})
									: photosArray.map((elem, i) => {
										if (i !== 0) {
											return (elem);
										}
										else return null;
									})
								}
							</div>
						</div>
						<div className={classes.uploadPic}>
        					<form className={classes.uploadForm}>
								<input 
									className={classes.fileInput}
        							type="file" 
        						    onChange={(e)=>props.handleImageChange(e)} 
								/>
									<i className={cx("fas fa-upload", classes.submitButton)} key={0} onClick={(e)=>props.handleSubmit(e)}></i>
        					</form>
        					<div className={classes.imgPreview} >
        						{imgPreview}
        					</div>
						</div>
					</div>
					<div className={classes.rightPart}>
						<div className={classes.rightTop}>
							<div className={classes.basicInfos}>
								<h3>{user.firstName} {user.lastName}</h3>
								<h4 className={classes.usernameAge}>{user.username}, {user.age} yo</h4>
								<h4 className={classes.genderSex}><i className={cx(genderIcon, classes.genderIcon)}></i>{gender}, {sexOrient}</h4>
							</div>
						</div>
						<div className={classes.rightMiddle}>
							<i className={cx("fas fa-quote-left", classes.left_quote)}></i>
							<div className={classes.bioCont}>
								<div className={classes.IAm}>
									<h5>I am...</h5>
									<div className={classes.tagContIAm}>
										{user.isTags.map((elem, i) => (
											<span key={i} className={classes.price_tag}>
												<Hashtag className={classes.hash}/> 
												{elem.text}
											</span>
										))}
									</div>
								</div>
								<div className={classes.bio}>
									<h4>{user.bio}</h4>
								</div>
								<div className={classes.lookingFor}>
									<h5>I'm interested In...</h5>
									<div className={classes.tagContInterest}>
										{user.lookTags.map((elem, i) => (
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
						<button
							className={classes.edit}
							onClick={props.editProfil}
						>Edit</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilDummy;
