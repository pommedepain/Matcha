import React from 'react'
// import NavBar from './NavBar'
// import SignUp from './SignUp'
// import Footer from './Footer'

// class App extends Component {
//   render() {
//     return (
//       <div>
//         <NavBar />
//         <SignUp />
//         <Footer />
//       </div>
//     );
//   }
// }

// import todosData from './jokesData'
// import TodoItem from './TodoItem'

// class App extends React.Component {
//   constructor() {
//     super()
//     this.state = {
//       todos: todosData
//     }
//     this.handleChange = this.handleChange.bind(this)
//   }

//   handleChange (id) {
//     this.setState(prevState => {
//       const updatedTodos = prevState.todos.map(todo => {
//         if (todo.id === id) {
//           todo.completed = !todo.completed
//         }
//         return todo
//       })
//       return {
//         todos: updatedTodos
//       }
//     })
//     console.log("changed !", id)
//   }

//   render() {
//     const todoItems = this.state.todos.map(item => <TodoItem key={item.id} item={item} 
//     handleChange={this.handleChange}/>)
//     let style = {
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center'
//     }
//     return (
//       <div style={style}>
//         {todoItems}
//       </div>
//     )
//   }
// }

// import Conditional from './Conditional'

// class App extends Component {
//   constructor() {
//     super()
//     this.state = {
//       logged: false
//     }
//     this.handleClick = this.handleClick.bind(this)
//   }

//   handleClick = () => {
//     this.setState(prevState => {
//       return {
//         logged: !prevState.logged
//       }
//     })
//   }

//   render() {
//     let h1Text = this.state.logged ? "Logged In" : "Logged out"
//     let buttonText = this.state.logged ? "Log Out" : "Log In"
//     return (
//       <div>
//         <h1 style={{textAlign: 'center'}}>{h1Text}</h1>
//         <button onClick={this.handleClick}>{buttonText}</button>
//       </div>
//     )
//   }
// }

class App extends React.Component {
  constructor() {
    super()
    this.state = {
      firstName: "", 
      lastName: "",
      age: "",
      gender: "",
      location: "",
      dietRestrict: {
        isVege: false,
        isVegan: false, 
        isKosher: false,
        isHalal: false
      }
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
    this.setState(prevState => {
      return {
        dietRestrict: {
          ...prevState.dietRestrict,
          [name]: checked
        }
      }
    })
    : this.setState({
      [name]: value
    })
  }

  render() {

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
            value={this.state.firstName}
            name="firstName"
            placeholder="First Name"
            onChange={this.handleChange}
          />
          <input
            type="text"
            value={this.state.lastName}
            name="lastName"
            placeholder="Last Name"
            onChange={this.handleChange}
          />
          <input
            type="number"
            // pattern="[0-9]*"
            value={this.state.age}
            name="age"
            placeholder="Age"
            onChange={this.handleChange}
          />


          <label>
            <input
              type="radio"
              value="male"
              name="gender"
              checked={this.state.gender === "male"}
              onChange={this.handleChange}
            /> Male
          </label>
          <label>
            <input
              type="radio"
              value="female"
              name="gender"
              checked={this.state.gender === "female"}
              onChange={this.handleChange}
            /> Female
          </label>

          <label>Destination:
            <br />
            <select
              onChange={this.handleChange}
              value={this.state.location}
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
                value={this.state.dietRestrict}
                name="isVege"
                onChange={this.handleChange}
                checked={this.state.dietRestrict.isVege}
              /> Vegetarian
            </label>
            <br />
            <label>
              <input 
                type="checkbox"
                value={this.state.dietRestrict}
                name="isVegan"
                onChange={this.handleChange}
                checked={this.state.dietRestrict.isVegan}
              /> Vegan
            </label>
            <br />
            <label>
              <input 
                type="checkbox"
                value={this.state.dietRestrict}
                name="isKosher"
                onChange={this.handleChange}
                checked={this.state.dietRestrict.isKosher}
              /> Kosher
            </label>
            <br />
            <label>
              <input 
                type="checkbox"
                value={this.state.dietRestrict}
                name="isHalal"
                onChange={this.handleChange}
                checked={this.state.dietRestrict.isHalal}
              /> Halal
            </label>
          </label>

          
          <br />
          <button>Submit</button>
        </form>

        <hr />
        <h2>Entered informations:</h2>
        <p>Your name: {this.state.firstName} {this.state.lastName}</p>
        <p>Your age: {this.state.age}</p>
        <p>Your gender: {this.state.gender}</p>
        <p>Your destination: {this.state.location}</p>
        <p>
          Your diatery restrictions:
          {console.log(this.state.dietRestrict)}
          {this.state.dietRestrict.length ?
            this.state.dietRestrict.map(restrict => {
              console.log(restrict)
              // restrict.value ?
              // restrict.name
              // : null
            })
            : null
          }
        </p>
      </main>
    )
  }
}

export default App
