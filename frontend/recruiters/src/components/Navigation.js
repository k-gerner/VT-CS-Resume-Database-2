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
        <Nav className="ml-auto">
          <Nav.Link className="navLink" href="/find-students" style={textStyle}>Find Students</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <Nav.Link className="navLink" href="/password-update" style={textStyle}>Update Password</Nav.Link>
          {currUser === null ?
              <Nav.Link className="navLink" href="/" style={textStyle}>Login</Nav.Link>
              :
              <Nav.Link className="navLink" href="/" style={textStyle} onClick={logoutAction}>Logout</Nav.Link>
            }
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}