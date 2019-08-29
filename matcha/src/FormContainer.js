import React from 'react'
import FormComponent from './FormComponent'

class FormContainer extends React.Component {
	constructor() {
	  super()
	  this.state = {
		firstName: "", 
		lastName: "",
		age: "",
		gender: "",
		location: "",
		isVege: false,
		isVegan: false, 
		isKosher: false,
		isHalal: false
	  }
	  this.handleChange = this.handleChange.bind(this)
	  this.handleSubmit = this.handleSubmit.bind(this)
	}
  
	handleSubmit(event) {
	  console.log(event.target)
	  alert(
		"First Name: " + event.target.firstName.value
		+ "\nLast Name: " + event.target.lastName.value
		+ "\nAge: " + event.target.age.value
		+ "\nGender: " + event.target.gender.value
		+ "\nLocation: " + event.target.location.value)
		// + "\nDiatery restrictions: " + event.target.dietRestrict.value)
	  event.preventDefault()
	}
  
	handleChange(event) {
	  const {name, value, checked, type} = event.target
	  type === "checkbox" ?
	  this.setState({
		[name]: checked
	  })
	  : this.setState({
		[name]: value
	  })
	}
  
	render() {
		return (
			<FormComponent 
				handleChange={this.handleChange}
				{...this.state}
			/>
		)
	}
  }
  
  export default FormContainer
  