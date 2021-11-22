import React, {useEffect, useState } from 'react';
import StudentInfo from './StudentInfo';
import StudentResume from './StudentResume';
import {Alert} from 'react-bootstrap';

export default function StudentDetail({ match, currUser }) {
    const [currStudent, setCurrStudent] = useState(null);

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
                }
            })
        }

        return () => {
            isUnmount = true;
        }
    }, [match.params.pid])

    return (
        <>
            {currUser !== null && currUser.type === "Recruiter" && currStudent !== null ?
                <>
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