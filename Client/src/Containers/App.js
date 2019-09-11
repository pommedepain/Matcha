import React, {Component} from 'react'
import NavBar from '../Components/NavBar'
import Main from '../Components/Forms/SSignUp'
import Footer from './Footer'

class App extends Component {
  render() {
    return (
      <div>
        <NavBar />
        <Main />
        <Footer />
      </div>
    );
  }
}

export default App
