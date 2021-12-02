import React, {useRef, useState} from 'react';
import {Button, Form, FormLabel, Alert} from 'react-bootstrap';
import { useHistory } from "react-router-dom";

export default function Login({currUser, setCurrUser}) {
    let history = useHistory();

    const [message, setMessage] = useState("");
    const [isValid, setIsValid] = useState(false);

    const emailRef = useRef();
    const passRef = useRef();

    const recruiterLogin = async () => {
        const email = emailRef.current.value;
        const password = passRef.current.value;

        const loginPackage = {
            "email": email,
            "password": password
        }


        const res = await fetch('http://localhost:8000/api/recruiter-login/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(loginPackage)
        })

        if(res.status === 200) {
            const newUser = {
                "username": email,
                "type": "Recruiter"
            }
            setCurrUser(newUser);
            localStorage.setItem('currUser', JSON.stringify(newUser))

            history.push('/find-students')

            setMessage("");
            setIsValid(true);
        }
        else if (res.status === 401) {
            setMessage("Username " + email + " does not exist")
            emailRef.current.value = null;
            passRef.current.value = null;
            setIsValid(false);
        }
        else if (res.status === 403) {
            setMessage("Your password is incorrect")
            passRef.current.value = null;
            setIsValid(false);
        }


    }

    const logoutAction = () => {
        setCurrUser(null);
        localStorage.setItem('currUser', null);
    }

    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    let loginBtnStyle = {
        marginRight: 10,
        backgroundColor: "#E95420",
        borderColor: "#E95420"
    }

    let logoutStyle = {
        fontSize: 35,
        marginLeft: "45%"
    }

    return (
            <>
                {currUser === null ?
                    <>
                        <h1 style={h1Style}>Login</h1>
                        <div className="container py-5 h-100 shadow p-3 mb-5 bg-white rounded">
                            {message !== "" && !isValid ?
                                <Alert variant="danger">{message}</Alert>
                                :
                                <></>
                            }
                            <Form>
                                <div className="form-group">
                                    <FormLabel>Email address</FormLabel>
                                    <input type="email" className="form-control" placeholder="Email" ref={emailRef}/>
                                </div>
                                <br/>
                                <div className="form-group">
                                    <FormLabel>Password</FormLabel>
                                    <input type="password" className="form-control" placeholder="Password" ref={passRef}/>
                                </div>
                                <br/>
                                <Button style={loginBtnStyle} className="btn btn-primary mb-2" onClick={recruiterLogin}>Login</Button>
                            </Form>
                        </div>
                    </>
                    :
                    <>
                        <h1 style={h1Style}>Logged in as {currUser.username}</h1>
                        <Button onClick={logoutAction} variant="danger" style={logoutStyle} className="btn btn-primary">Logout?</Button>
                    </>
                }
            </>
    )
}