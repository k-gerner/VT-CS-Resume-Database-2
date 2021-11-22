import React, {useRef, useState} from 'react';
import {Button, Form, FormLabel, Alert} from 'react-bootstrap';

export default function CreateRecruiter({currUser}) {
    const [message, setMessage] = useState("");
    const [isValid, setIsValid] = useState(false);

    const emailRef = useRef();
    const passRef = useRef();
    const companyRef = useRef();

    const create = async () => {
        const email = emailRef.current.value;
        const password = passRef.current.value;
        const company = companyRef.current.value;

        // Do email / password validation here.
        // (Set alert message).


        const newRecruiter = {
            "email": email,
            "password": password,
            "company": company,
            "type": currUser.type,
        }

        const res = await fetch('http://localhost:8000/api/create-recruiter/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newRecruiter)
        })

        if(res.status === 201) {
            setMessage("User " + email + " created successfully");
            setIsValid(true);
        }
        else if (res.status === 400) {
            setMessage("Recruiter " + email + " already exists");
            setIsValid(false);
        }

        emailRef.current.value = null;
        passRef.current.value = null;
        companyRef.current.value = null;
    }


    // <---------------- STYLING ---------------->
    let createBtnStyle = {
        marginRight: 10,
        backgroundColor: "#E95420",
        borderColor: "#E95420"
    }

    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    return (
        <>
            {currUser !== null && currUser.type === "Administrator" ?
                <>
                    <h1 style={h1Style}>Recruiter Account Creation</h1>

                    <div className="container py-5 h-100 shadow p-3 mb-5 bg-white rounded">
                        {message !== "" && !isValid ?
                            <Alert variant="danger">{message}</Alert>
                            :
                            <></>
                        }

                        {message !== "" && isValid ?
                            <Alert variant="success">{message}</Alert>
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
                                <label>Password</label>
                                <input type="password" className="form-control" placeholder="Password" ref={passRef}/>
                            </div>
                            <br/>
                            <div className="form-group">
                                <FormLabel>Company Name</FormLabel>
                                <input type="text" className="form-control" placeholder="Company Name" ref={companyRef}/>
                            </div>
                            <br/>
                            <Button style={createBtnStyle} className="btn btn-primary" onClick={create}>Create Recruiter</Button>
                        </Form>
                    </div>
                </>
            :
                <h1 style={h1Style}>You do not have access to this page</h1>
            }
        </>
    )
}