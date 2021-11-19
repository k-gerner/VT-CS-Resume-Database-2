import React, {useRef, useState} from 'react';
import {Button, Form, FormLabel, Alert} from 'react-bootstrap';

export default function PasswordUpdate ({currUser}) {
    const [message, setMessage] = useState("");
    const [isValid, setIsValid] = useState(false);

    const oldPassRef = useRef();
    const newPassRef = useRef();
    const reNewPassRef = useRef();


    const changePassword = async () => {
        const oldPass = oldPassRef.current.value;
        const newPass = newPassRef.current.value;
        const reNewPass = reNewPassRef.current.value;

        if (newPass !== reNewPass) {
            setMessage("New passwords do not match")
            newPassRef.current.value = null;
            reNewPassRef.current.value = null;
            setIsValid(false);
            return;
        } 

        const passReset = {
            "oldPassword": oldPass,
            "newPassword": newPass,
            "Type": currUser.type,
            "Username": currUser.username
        }

        const res = await fetch('http://localhost:8000/api/update-password/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(passReset)
        })

        if (res.status === 200) {
            setMessage("Password updated successfully");
            setIsValid(true);
        }
        else if (res.status === 403) {
            setMessage("New password cannot be same as old password");
            setIsValid(false);
        }
        else if (res.status === 401) {
            setMessage("Incorrect old password")
            setIsValid(false)
        }

        oldPassRef.current.value = null
        newPassRef.current.value = null
        reNewPassRef.current.value = null
    }


    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    let btnStyle = {
        marginRight: 10,
        backgroundColor: "#E95420",
        borderColor: "#E95420"
    }

    return (
        <>
            {currUser !== null && currUser.type === "Recruiter"?
                <>
                <h1 style={h1Style}>Change Password</h1>
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
                            <FormLabel>Old Password</FormLabel>
                            <input type="password" className="form-control" placeholder="Password" ref={oldPassRef}/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <FormLabel>New Password</FormLabel>
                            <input type="password" className="form-control" placeholder="Password" ref={newPassRef}/>
                        </div>
                        <br/>
                        <div className="form-group">
                            <FormLabel>Re-enter New Password</FormLabel>
                            <input type="password" className="form-control" placeholder="Password" ref={reNewPassRef}/>
                        </div>
                        <br/>
                        <Button style={btnStyle} className="btn btn-primary mb-2" onClick={changePassword}>Change Password</Button>
                    </Form>
                </div>
            </>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </>
    );
}