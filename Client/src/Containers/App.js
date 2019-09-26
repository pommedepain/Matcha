import React, {Component} from 'react'
import { BrowserRouter } from 'react-router-dom'

import NavBar from '../Components/NavBar'
import Main from '../Components/Forms/SignUp/SignUpS'
import Footer from './Footer'

class App extends Component {
  render() {
    return (
      <BrowserRouter >
        <NavBar />
        <Main />
        <Footer />
      </BrowserRouter>
    );
  }
}

export default App
