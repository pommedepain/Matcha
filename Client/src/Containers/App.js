import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import io from 'socket.io-client';

import NavBar from '../Components/NavBar/NavBar';
// import Main from '../Containers/Main';
import Home from '../Components/Home/HomeS';
import SignUp from '../Components/Forms/SignUp/SignUpS';
// import LogIn from '../Components/Forms/LogIn/LoginS';
import Account from '../Components/Forms/Account/AccountS';
import Footer from './Footer';
import UserContextProvider from '../Contexts/UserContext';
import PrivateRoute from './PrivateRoute';
// const mySocket = io('http://localhost:5000');

class App extends Component {
  render() {
    return (
      <Router>
        <UserContextProvider>
          <div>
			    	<NavBar />
            <Switch>
              {/* <Route path="/" exact component={Home} /> */}
              <PrivateRoute path="/" exact component={Home} />
              <PrivateRoute path="/home" component={Home} />
              <Route path="/sign-up" component={SignUp} />
              {/* <Route path="/login" component={LogIn} /> */}
              <PrivateRoute path="/account" component={Account} />
            </Switch>
			    	<Footer />
			    </div>
        </UserContextProvider>
      </Router>
    );
  }
}

export default App
