import React, {Component} from 'react'
import NavBar from '../Components/NavBar'
import SignUp from '../Components/Forms/Sign Up/SignUp'
import Footer from './Footer'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:4000/API/users")
        .then(res => res.text())
        .then(res => this.setState({ apiResponse: res }))
        .catch(err => err);
  }

  UNSAFE_componentWillMount() {
    this.callAPI();
  }

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
