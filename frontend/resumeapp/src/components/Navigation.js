import {Navbar, Nav, Container} from 'react-bootstrap';
import './../main.css'

export default function Navigation ({currUser, setCurrUser}) {

  const logoutAction = () => {
    setCurrUser(null);
    localStorage.setItem('currUser', null);
  }

  // <---------------- STYLING ---------------->
  let navbarStyle = {
    backgroundColor: "#772953",
    borderColor: "#772953"
  }

  let textStyle = {
    color: "#fff",
    marginRight: 25
  }



  return (
    <Navbar style={navbarStyle} expand="lg">
    <Container>
      <Navbar.Brand style={textStyle}>VT CS Resume Database</Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        
          {currUser === null ?
            <Nav className="ms-auto">
            <Nav.Link className="navLink" href="/" style={textStyle}>Login</Nav.Link>
            </Nav>
            :
            currUser.type === "Student" ? 
              <>
              <Nav className="ml-auto">
              <Nav.Link className="navLink" href="/profile" style={textStyle}>Profile</Nav.Link>
              </Nav>
              {/* <Nav.Link className="navLink" href="/" style={textStyle} onClick={logoutAction}>Logout</Nav.Link> */}
              </>
            :
              <>
              <Nav className="ml-auto">
              <Nav.Link className="navLink" href="/view-all-students" style={textStyle}>View All Students</Nav.Link>
              <Nav.Link className="navLink" href="/all-skill-tags" style={textStyle}>Skill Tags</Nav.Link>
              <Nav.Link className="navLink" href="/view-all-recruiters" style={textStyle}>Recruiters</Nav.Link>
              <Nav.Link className="navLink" href="/create-recruiter" style={textStyle}>Create Recruiter</Nav.Link>
              </Nav>
              {/* <Nav.Link className="navLink" href="/" style={textStyle} onClick={logoutAction}>Logout</Nav.Link> */}
              </>
            
          }
          {
            currUser !== null &&
            <Nav className="ms-auto">
                <Nav.Link className="navLink" href="/" style={textStyle} onClick={logoutAction}>Logout</Nav.Link>
            </Nav>
          }

        {/* <Nav className="ms-auto">
          <Nav.Link className="navLink" href="/" style={textStyle} onClick={logoutAction}>Logout</Nav.Link>
        </Nav> */}
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}