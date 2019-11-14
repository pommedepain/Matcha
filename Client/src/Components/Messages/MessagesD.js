import React from 'react';
import cx from 'classnames';

import classes from './Messages.module.css';
import Input from '../Utils/Input/Input';

const MessagesDummy = (props) => {
	const user = props.JWT.data;
	// console.log(props.messagesList)
	return (
		<div className={classes.main}>
			<div className={classes.usersList}>
				{props.matchList ?
					props.matchList.map((elem, i) => {
						return (
							<div key={i} className={classes.userDiv} onClick={(e) => props.getConversation(e, elem.user.username)} >
								<img src={elem.user.photos[0]} alt="profil" className={classes.photo} />
								<div className={classes.names}>{elem.user.firstName} {elem.user.lastName}</div>
							</div>)
					})
					: null
				}
			</div>
			<div className={classes.messages}>
				<div className={classes.messagesList}>
					{props.messagesList ?
						props.messagesList.map((elem, i) => {
							if (elem.emitter !== user.username) {
								return (
									<div className={classes.takePlaceLeft} key={i} >
										<blockquote className={classes.speech_bubble}>
											<p>{elem.message}</p>
											<cite>{elem.date}</cite>
										</blockquote>
									</div>
								);
							}
							else {
								return (
									<div className={classes.takePlaceRight} key={i} >
										<blockquote className={cx(classes.speech_bubbleSent)}>
											<p>{elem.message}</p>
											<cite>{elem.date}</cite>
										</blockquote>
									</div>
								);
							}
						})
						: null
					}
				</div>
				<div className={classes.sendBar}>
					<Input
						id={props.sendBar.title}
						key={props.sendBar.title}
						elementType={props.sendBar.elementType}
						elementConfig={props.sendBar.elementConfig}
						value={props.sendBar.value}
						changed={(event) => props.inputChangedHandler(event, props.sendBar.title)}
						invalid={!props.sendBar.valid}
						shouldValidate={props.sendBar.validation}
						touched={props.sendBar.touched}
					/>
					<i className={cx("fas fa-paper-plane", classes.send)} onClick={props.sendMessage}></i>
				</div>
			</div>
		</div>
	)
}

export default MessagesDummy;
