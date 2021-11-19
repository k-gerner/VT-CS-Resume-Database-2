import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Login from './components/Login';
import Navigation from './components/Navigation';
import CreateRecruiter from './components/CreateRecruiter';
import Profile from './components/Profile';
import ResumeUpload from './components/ResumeUpload'

function App() {

  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('currUser');
    if(data) {
      setCurrUser(JSON.parse(data));
    }
  }, [])

  return (
    <>
      <Router>
        <Navigation currUser={currUser} />
        <Switch>
          <Route path="/" exact component={() => <Login currUser={currUser} setCurrUser={setCurrUser} />} />
          <Route path="/create-recruiter" exact component={() => <CreateRecruiter currUser={currUser} /> } />
          <Route path="/profile" exact component={() => <Profile currUser={currUser} /> } />
          <Route path="/upload-resume" exact component={() => <ResumeUpload currUser={currUser} /> } />
        </Switch>
      </Router>
    </>
  );
}

export default App;
