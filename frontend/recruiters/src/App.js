import React, {useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import Login from './components/Login';
import Navigation from './components/Navigation';
import StudentList from './components/StudentList';
import StudentDetail from './components/StudentDetail';
import StudentSearch from './components/StudentSearch';
import PasswordUpdate from './components/PasswordUpdate';

function App() {
  const [currUser, setCurrUser] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('currUser');
    if(data && data !== "null") {
      fetch('http://localhost:8000/api/recruiter-exists/', { 
          method: 'POST',
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({"username": JSON.parse(data).username})
      })
      .then((res) => {
          if(res.status === 200) {
              setCurrUser(JSON.parse(data));
          }
      })
    }
  }, [])

  return (
    <>
      <Router>
        <Navigation currUser={currUser} />
        <Switch>
          <Route path="/" exact component={() => <Login currUser={currUser} setCurrUser={setCurrUser} />} />
          <Route path="/find-students" exact component={() => <StudentList currUser={currUser} />} />
          <Route path="/student/:pid" exact component = {(props) => <StudentDetail currUser={currUser} {...props} />} />
          <Route path="/student-search/:skills/:classes/:job_descriptions/:exact_matches" exact component = {(props)=> <StudentSearch currUser={currUser} {...props} />} />
          <Route path="/password-update" exact component={() => <PasswordUpdate currUser={currUser} />} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
