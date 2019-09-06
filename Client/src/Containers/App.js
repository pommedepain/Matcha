import React, {Component} from 'react'
import NavBar from '../Components/NavBar'
import SignUp from '../Components/Forms/Sign Up/SignUp'
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
