import React, {useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import StudentInfo from './StudentInfo';
import StudentResume from './StudentResume';
import {Alert, Button} from 'react-bootstrap';

export default function StudentDetail({ match, currUser }) {
    let history = useHistory();

    const [currStudent, setCurrStudent] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isUnmount = false;
        const data = localStorage.getItem('currUser');
        var tempUser = null

        if(data) {
            tempUser = JSON.parse(data);
        }

        if(tempUser !== null) {
            fetch('http://localhost:8000/api/student/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"StudentPID" : match.params.pid, "Type": tempUser.type})
            })
            .then((res) => {
                return res.json();
            })
            .then((jsonData) => {
                if(!isUnmount) {
                    console.log(jsonData.resume);
                    setCurrStudent(jsonData);
                    setLoading(false);
                }
            })
        }

        return () => {
            isUnmount = true;
        }
    }, [match.params.pid])

    let btnStyle = {
        backgroundColor: "#E95420",
        borderColor: "#E95420",
        marginLeft:"1%",
        marginTop:"1%"
    }

    return (
        <>
            {(currUser !== null && currUser.type === "Recruiter" && currStudent !== null) || loading ?
                <>
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={() => history.goBack()}>Back</Button>
                    <div className="outerProfile">
                        <div className="profileDetails">
                            <StudentInfo currStudent={currStudent} />
                        </div>
                        <div className="resumeView">
                            <StudentResume currStudent={currStudent} />
                        </div>
                    </ div>
                </>
                :
                <Alert variant="danger">
                <Alert.Heading>Something went wrong...</Alert.Heading>
                    <p>
                        You must be logged in as a recruiter to access this page.
                    </p>
                </Alert>
            }
        </>
    );
}