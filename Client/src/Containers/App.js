import React, { Component } from 'react'
import { BrowserRouter as Router, /*Route,*/ Switch } from 'react-router-dom';

import NavBar from '../Components/NavBar/NavBarS';
// import Main from '../Containers/Main';
import Home from '../Components/Home/HomeS';
import SignUp from '../Components/Forms/SignUp/SignUpS';
// import LogIn from '../Components/Forms/LogIn/LoginS';
import Account from '../Components/Forms/Account/AccountS';
import Footer from './Footer';
import Profil from '../Components/Profil/ProfilS';
import Search from '../Components/Search/SearchS';
import Messages from '../Components/Messages/MessagesS';
import Matches from '../Components/Matches/MatchesS';
// import UserContextProvider from '../Contexts/UserContext';
import PrivateRoute from './PrivateRoute';

// import { UserContext } from '../Contexts/UserContext';

class App extends Component {

  // static contextType = UserContext;

  // componentWillUpdate() {
  //   const { JWT } = this.context;
  //   if (JWT.token !== null && JWT.data.firstName) {
  //     let dateNow = new Date();
  //     console.log(JWT.exp);
  //     console.log(dateNow.getTime() / 1000);
  //     if (JWT.exp < (dateNow.getTime() / 1000)) {
  //       this.context.toggleUser(null);
  //     }
  //   }
  // }

  render() {
    return (
      <Router>
        {/* <UserContextProvider> */}
          <div>
			    	<NavBar />
            <Switch>
              <PrivateRoute path="/" exact component={Home} />
              <PrivateRoute path="/home" component={Home} />
              <PrivateRoute path="/sign-up" component={SignUp} />
              <PrivateRoute path="/account" component={Account} />
              <PrivateRoute path="/profil" component={Profil} />
              <PrivateRoute path="/search" component={Search} />
              <PrivateRoute path="/messages" component={Messages} />
              <PrivateRoute path="/matches" component={Matches} />
            </Switch>
			    	<Footer />
			    </div>
        {/* </UserContextProvider> */}
      </Router>
    );
  }
}

export default App
