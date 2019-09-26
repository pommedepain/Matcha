import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NavBar from '../Components/NavBar';
import SignUp from '../Components/Forms/SignUp/SignUpS';
import Footer from './Footer';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
			  	<NavBar />
          <Switch>
            <Route path="/" exact component={SignUp} />
          </Switch>
			  	<Footer />
			  </div>
      </Router>
    );
  }
}

export default App
