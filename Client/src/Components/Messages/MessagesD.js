import React from 'react';
import cx from 'classnames';

import classes from './Messages.module.css';
import Input from '../Utils/Input/Input';

const MessagesDummy = (props) => {
	console.log(props.messagesList)
	return (
		<div className={classes.main}>
			<div className={classes.usersList}>
				{props.matchList ?
					props.matchList.map((elem, i) => {
						console.log(elem)
						return (
							<div key={i} className={classes.userDiv} onClick={(e) => props.getConversation(e, elem.username)} >
								<img src={elem.photos[0]} alt="profil" className={classes.photo} />
								<div className={classes.names}>{elem.firstName} {elem.lastName}</div>
							</div>)
					})
					: null
				}
			</div>
			<div className={classes.messages}>
				<div className={classes.messagesList}>
					{props.messagesList ?
						props.messagesList.map((elem, i) => {
							console.log(elem);
							return (<div key={i}>{elem.message}</div>);
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
					<i className={cx("fas fa-paper-plane", classes.send)}></i>
				</div>
			</div>
		</div>
	)
}

export default MessagesDummy;
