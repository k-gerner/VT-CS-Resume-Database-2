import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Login from './components/Login';
import Navigation from './components/Navigation';
import CreateRecruiter from './components/CreateRecruiter';
import Profile from './components/Profile';
import StudentDetail from './components/StudentDetail';
import ResumeUpload from './components/ResumeUpload';
import StudentList from './components/StudentList';
import RecruiterList from './components/RecruiterList';

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
          <Route path="/view-all-students" exact component={() => <StudentList currUser={currUser} />} />
          <Route path="/view-all-recruiters" exact component={() => <RecruiterList currUser={currUser} />} />
          <Route path="/student/:pid" exact component = {(props) => <StudentDetail currUser={currUser} {...props} />} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
