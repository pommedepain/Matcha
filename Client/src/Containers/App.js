import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import NavBar from '../Components/NavBar/NavBar';
import Main from '../Containers/Main';
import SignUp from '../Components/Forms/SignUp/SignUpS';
import LogIn from '../Components/Forms/LogIn/LoginS';
import Account from '../Components/Forms/Account/AccountS';
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
              <Route path="/" exact component={Main} />
              <Route path="/home" component={Main} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/log-in" component={LogIn} />
              <Route path="/account" component={Account} />
            </Switch>
			    	<Footer />
			    </div>
        </UserContextProvider>
      </Router>
    );
  }
}

export default App
