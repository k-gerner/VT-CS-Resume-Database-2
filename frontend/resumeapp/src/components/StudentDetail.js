import React, {useEffect, useState } from 'react';
import StudentResume from './StudentResume';
import AdminStudentInfo from './AdminStudentInfo';

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

    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }
    return (
        <>
            {currUser !== null && currUser.type === "Administrator" && currStudent !== null ?
                <>
                    <div className="outerProfile">
                        <div className="profileDetails">
                            <AdminStudentInfo currStudent={currStudent} />
                        </div>
                        <div className="resumeView">
                            <StudentResume currStudent={currStudent} />
                        </div>
                    </ div>
                </>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </>
    );
}