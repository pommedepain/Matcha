import React from 'react'

const TodoItem = (props) => {
	console.log(props.item.completed)
	console.log(props.item.id)
	let style = {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		border: '1px solid black',
		width: '20%',
		marginBottom: '2%'
	}
	let color = {
		color: 'green'
	}
	return (
		<div style={style}>
			<input 
				type="checkbox" 
				checked={props.item.completed} 
				onChange={() => props.handleChange(props.item.id)}
			/>
			<p style={props.item.completed ? color : null}>{props.item.text}</p>
		</div>
	)
}

export default TodoItem
