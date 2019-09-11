import React, { Component } from 'react'
import { WithContext as ReactTags } from 'react-tag-input'

import './Tags.css'

const KeyCodes = {
	comma: 118,
	enter: 13, 
	tab: 9
};

const delimiters = [KeyCodes.comma, KeyCodes.enter, KeyCodes.tab];

class Tags extends Component {
	state = {
		// tags: [
		// 	{ id: "athlete", text: "Athlete" },
		// 	{ id: "geek", text: "Geek" }
		// ],
		suggestions: [
			{ id: "cinema", text: "Cinema Lover" },
			{ id: "traveler", text: "Traveler" },
			{ id: "cat", text: "Cat Person" },
			{ id: "dog", text: "Dog Person" },
			{ id: "nature", text: "Nature Lover" },
			{ id: "family", text: "Family-Oriented" },
			{ id: "party", text: "Party Animal" },
			{ id: "book", text: "Bookworm" },
			{ id: "extrovert", text: "Extrovert" },
			{ id: "introvert", text: "Introvert" },
			{ id: "creative", text: "Creative" },
			{ id: "animal", text: "Animal Lover" },
			{ id: "arts", text: "Patron of the Arts" },
		]
	}
	
	// handleDelete = (i) => {
	// 	const { tags } = this.state
	// 	this.setState({
	// 		tags: tags.filter((tag, index) => index !== i),
	// 	})
	// }

	// handleAddition = (tag) => {
	// 	this.setState(
	// 		state => ({ tags: [...state.tags, tag] })
	// 	)
	// }

	// handleDrag = (tag, currPos, newPos) => {
	// 	const tags = [...this.state.tags]
	// 	const newTags = tags.slice()

	// 	console.log("currPos: " + currPos + ", newPos: " + newPos)
	// 	console.log(tag)
	// 	newTags.splice(currPos, 1)
	// 	newTags.splice(newPos, 0, tag)

	// 	/* re-render */
	// 	this.setState({ tags: newTags })
	// }

	render() {
		return (
			<div className={this.props.divclassname}>
				<h3 className={this.props.h3classname}>What traits do you find most attractive?</h3>
				<ReactTags
					tags={this.props.tags}
					suggestions={this.state.suggestions}
					handleDelete={this.props.handleDelete}
					handleAddition={this.props.handleAddition}
					// handleDrag={this.handleDrag.bind(this)}
					delimiters={delimiters}
					minQueryLength={0}
					inputFieldPosition="top"
					allowDeleteFromEmptyInput={false}
					allowDragDrop={false}
				/>
			</div>
		)
	}
}

export default Tags
