import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Navbar from './components/navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Dashboard.jsx';
import IssueDetails from './pages/IssueDetails.jsx';
import Profile from './pages/Profile.jsx';
import Map from './pages/Map.jsx';
import IssueForm from './pages/IssueForm.jsx';
import UserDetails from './pages/UserDetail';
// ....
import AddUserRole from './pages/AddUserRole';

import './styles/App.css';

import { getSuperTokensRoutesForReactRouterDom } from "supertokens-auth-react/ui";
import { ThirdPartyPreBuiltUI } from 'supertokens-auth-react/recipe/thirdparty/prebuiltui';
import { EmailPasswordPreBuiltUI } from 'supertokens-auth-react/recipe/emailpassword/prebuiltui';
import * as reactRouterDom from "react-router-dom";
import { SessionAuth } from 'supertokens-auth-react/recipe/session/index.js';
import Session from 'supertokens-auth-react/recipe/session'
// TODO 1: We need to create a Login, Signup, logout and Profile page 
// TODO 2: We need to send the userName field too in the issueForm dataForm Object, otherwise we cant identify who raise the issue.
// TODO 3: Ask for location permission in heat map and focus the map on those lats and longs
// TODO 4: I would like to have two drop down bars at issue details, 1) would be my Issues, 2) would be Issues near me
// TODO 5: Dont forget to hash the passwords incase i dont use google Oauth

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userDetails, setUserDetails] = useState(undefined);


  // TODO: have to set logged in state as false in logout button and set undefined for UserDetail
  // TODO: API keys are exposed, clean it up 
  useEffect(() => {
    if(Session.doesSessionExist){
      setIsLoggedIn(true);
      setUserDetails(Session.getUserId());
    }
  }, []);

  useEffect(()=>{
    console.log('User Details:', userDetails);
    console.log(isLoggedIn);
  }, [userDetails, isLoggedIn]);
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<SessionAuth><Dashboard /> </SessionAuth>} />
        <Route path="/map" element={<SessionAuth><Map /></SessionAuth>} />
        <Route path="/issuedetails" element={<SessionAuth><IssueDetails /></SessionAuth>} />
        <Route path="/issueform" element={<SessionAuth><IssueForm /></SessionAuth>} />
        <Route path="/profile" element={<SessionAuth><Profile /></SessionAuth>} />
        {getSuperTokensRoutesForReactRouterDom(reactRouterDom, [ThirdPartyPreBuiltUI, EmailPasswordPreBuiltUI])}

        <Route path="/add-role" element={<AddUserRole />} />
        <Route path="/user-details" element={<UserDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
