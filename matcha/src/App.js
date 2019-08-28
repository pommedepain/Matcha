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
    this.state = {}
  }

  componentDidMount() {
    fetch("https://swapi.co/api/people/1")
      .then(response => response.json())
      .then(data => console.log(data))
  }

  render() {
    return (
      <div>
        Code goes here
      </div>
    )
  }
}

export default App
