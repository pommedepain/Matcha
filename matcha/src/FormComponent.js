import React from 'react'

const FormComponent = props => {
	const style = {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center', 
		marginTop: '5%'
	}

	return (
		<main>
		  <form style={style} onSubmit={this.handleSubmit}>
			<input
			  type="text"
			  value={props.firstName}
			  name="firstName"
			  placeholder="First Name"
			  onChange={props.handleChange}
			/>
			<input
			  type="text"
			  value={props.lastName}
			  name="lastName"
			  placeholder="Last Name"
			  onChange={props.handleChange}
			/>
			<input
			  type="number"
			  // pattern="[0-9]*"
			  value={props.age}
			  name="age"
			  placeholder="Age"
			  onChange={props.handleChange}
			/>
  
  
			<label>
			  <input
				type="radio"
				value="male"
				name="gender"
				checked={props.gender === "male"}
				onChange={props.handleChange}
			  /> Male
			</label>
			<label>
			  <input
				type="radio"
				value="female"
				name="gender"
				checked={props.gender === "female"}
				onChange={props.handleChange}
			  /> Female
			</label>
  
			<label>Destination:
			  <br />
			  <select
				onChange={props.handleChange}
				value={props.location}
				name="location"
			  >
				<option value="">-- Please choose a destination --</option>
				<option value="japan">Japan</option>
				<option value="usa">USA</option>
				<option value="france">France</option>
				<option value="spain">Spain</option>
				<option value="mexico">Mexico</option>
			  </select>
			</label>
  
			<label>Diatery restrictions:
			  <br />
			  <label>
				<input 
				  type="checkbox"
				  value={props.dietRestrict}
				  name="isVege"
				  onChange={props.handleChange}
				  checked={props.isVege}
				/> Vegetarian
			  </label>
			  <br />
			  <label>
				<input 
				  type="checkbox"
				  value={props.dietRestrict}
				  name="isVegan"
				  onChange={props.handleChange}
				  checked={props.isVegan}
				/> Vegan
			  </label>
			  <br />
			  <label>
				<input 
				  type="checkbox"
				  value={props.dietRestrict}
				  name="isKosher"
				  onChange={props.handleChange}
				  checked={props.isKosher}
				/> Kosher
			  </label>
			  <br />
			  <label>
				<input 
				  type="checkbox"
				  value={props.dietRestrict}
				  name="isHalal"
				  onChange={props.handleChange}
				  checked={props.isHalal}
				/> Halal
			  </label>
			</label>
  
			
			<br />
			<button>Submit</button>
		  </form>
  
		  <hr />
		  <h2>Entered informations:</h2>
		  <p>Your name: {props.firstName} {props.lastName}</p>
		  <p>Your age: {props.age}</p>
		  <p>Your gender: {props.gender}</p>
		  <p>Your destination: {props.location}</p>
		  <p>Your diatery restrictions:</p>
		  <p>Vegan: {props.isVegan ? "Yes" : "No"}</p>
		  <p>Vegeterian: {props.isVege ? "Yes" : "No"}</p>
		  <p>Kosher: {props.isKosher ? "Yes" : "No"}</p>
		  <p>Halal: {props.isHalal ? "Yes" : "No"}</p>
		</main>
	)
}

export default FormComponent 
