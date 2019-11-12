import React from 'react';
import cx from 'classnames';

import classes from './Profil.module.css';
import Hashtag from '../../Icons/hashtag';
import MapContainer from '../Geolocalisation/MapContainer';
import Input from '../Utils/Input/Input';
import AlertBox from '../Utils/AlertBox/AlertBox';
import Tags from '../Utils/Tags/Tags';

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
    let imgPreview = [];
    if (imagePreviewUrl) {
		for (let l = 0; l < imagePreviewUrl.length; l++) {
			imgPreview[l] = <img src={imagePreviewUrl[l]} alt="preview" key={l}/>;
		}
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

	let formElementsArray = [];
	// eslint-disable-next-line no-unused-vars
	for (let key in props.orderForm) {
		formElementsArray.push({
			id: key,
			config: props.orderForm[key]
		});
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
									accept="image/*"
									multiple={true}
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
								{props.edit.active ?
									[<div className={classes.ageEdit} key={0} >
										<h4 className={classes.usernameAge}>{user.username}</h4>
										<Input 
											key={formElementsArray[0].id}
											elementType={formElementsArray[0].config.elementType}
											elementConfig={formElementsArray[0].config.elementConfig}
											value={formElementsArray[0].config.value}
											changed={(event) => props.inputChangedHandler(event, formElementsArray[0].id)}
											invalid={!formElementsArray[0].config.valid}
											shouldValidate={formElementsArray[0].config.validation}
											touched={formElementsArray[0].config.touched}
										/>
									</div>]
									: <h4 className={classes.usernameAge}>{user.username}, {user.age} yo</h4>
								}
								{props.edit.active ? 
									[<div className={classes.genderSexualOrient} key={0} >
										<Input 
											key={formElementsArray[1].id}
											elementType={formElementsArray[1].config.elementType}
											elementConfig={formElementsArray[1].config.elementConfig}
											value={formElementsArray[1].config.value}
											changed={(event) => props.inputChangedHandler(event, formElementsArray[1].id)}
											invalid={!formElementsArray[1].config.valid}
											shouldValidate={formElementsArray[1].config.validation}
											touched={formElementsArray[1].config.touched}
										/>
										<Input 
											key={formElementsArray[2].id}
											elementType={formElementsArray[2].config.elementType}
											elementConfig={formElementsArray[2].config.elementConfig}
											value={formElementsArray[2].config.value}
											changed={(event) => props.inputChangedHandler(event, formElementsArray[2].id)}
											invalid={!formElementsArray[2].config.valid}
											shouldValidate={formElementsArray[2].config.validation}
											touched={formElementsArray[2].config.touched}
										/>
									</div>]
									: <h4 className={classes.genderSex}><i className={cx(genderIcon, classes.genderIcon)}></i>{gender}, {sexOrient}</h4> 
								}
							</div>
						</div>
						<div className={classes.rightMiddle}>
							<i className={cx("fas fa-quote-left", classes.left_quote)}></i>
							<div className={classes.bioCont}>
							{props.showAlert ? 
								<AlertBox 
									message="Please choose a Tag amongst the suggestions"
									button="Try Again"
									color="red"
									handleChange={props.handleChangeTags}
								/>
								: null
							}
								<div className={classes.IAm}>
									<h5>I am...</h5>
									{props.edit.active ?
										[<Tags 
											styling={true}
											title=""
											divclassname={classes.IAmTags}
											h3classname={classes.questionsS3}
											tags={props.isTags}
											handleDelete={props.handleDeleteIAm}
											handleAddition={props.handleAdditionIAm}
											key={0}
										/>]
										: [<div className={classes.tagContIAm} key={0}>
											{user.isTags.map((elem, i) => (
												<span key={i} className={classes.price_tag}>
													<Hashtag className={classes.hash}/> 
													{elem.text}
												</span>
											))}
										</div>]
									}
								</div>
								<div className={classes.bio}>
									{props.edit.active ?
										[<Input 
											key={formElementsArray[3].id}
											elementType={formElementsArray[3].config.elementType}
											elementConfig={formElementsArray[3].config.elementConfig}
											value={formElementsArray[3].config.value}
											changed={(event) => props.inputChangedHandler(event, formElementsArray[3].id)}
											invalid={!formElementsArray[3].config.valid}
											shouldValidate={formElementsArray[3].config.validation}
											touched={formElementsArray[3].config.touched}
										/>]
										: <h4>{user.bio}</h4> 
									}
								</div>
								<div className={classes.lookingFor}>
									<h5>I'm interested In...</h5>
									{props.edit.active ?
										[<Tags 
											styling={true}
											title=""
											divclassname={classes.lookingForTags}
											h3classname={classes.questionsS3}
											tags={props.lookTags}
											handleDelete={props.handleDeleteLookFor}
											handleAddition={props.handleAdditionLookFor}
											key={0}
										/>]
										: [<div className={classes.tagContInterest} key={0} >
											{user.lookTags.map((elem, i) => (
												<span key={i} className={classes.price_tag}>
													<Hashtag className={classes.hash}/> 
													{elem.text}
												</span>
											))}
										</div>]
									}
								</div>
							</div>
							<i className={cx("fas fa-quote-right", classes.right_quote)}></i>
						</div>
						<button
							className={cx(classes.edit, "edit")}
							onClick={props.editProfil}
						>{props.edit.active ? 'Save' : 'Edit'}</button>
					</div>
				</div>
				<div className={classes.secondRow}>
					<div className={classes.geolocCont} >
						<MapContainer className={classes.map} />
					</div>
					<div className={classes.cercle}>
						<div className={classes.matchIndicator}>
							<h3 className={classes.percentage}>{user.popularity} <i className="fas fa-percentage"></i></h3>
							<h3 className={classes.popularity}>popularity</h3>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProfilDummy;
