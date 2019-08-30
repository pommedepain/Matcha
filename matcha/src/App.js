import React, {Component} from 'react'
import NavBar from './NavBar'
import SignUp from './SignUp'
import Footer from './Footer'

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <SignUp />
        <Footer />
      </div>
    );
  }
}

export default App
