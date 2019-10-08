import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NavBar from '../Components/NavBar/NavBar';
import SignUp from '../Components/Forms/SignUp/SignUpS';
import LogIn from '../Components/Forms/LogIn/LoginS';
import Footer from './Footer';
import UserContextProvider from '../Contexts/UserContext';

class App extends Component {
  render() {
    return (
      <Router>
        <UserContextProvider>
          <div>
			    	<NavBar />
            <Switch>
              <Route path="/" exact component={SignUp} />
              <Route path="/home" component={SignUp} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/log-in" component={LogIn} />
            </Switch>
			    	<Footer />
			    </div>
        </UserContextProvider>
      </Router>
    );
  }
}

export default App
