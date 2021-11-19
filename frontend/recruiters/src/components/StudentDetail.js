import React, {useEffect, useState } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

export default function StudentDetail({ match, currUser }) {
    const defaultLayout = defaultLayoutPlugin();

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

    const skillTagConvert = (skillTags) => {
        var tempArr = []
        skillTags.map((tag) => (
            tempArr.push(tag.name)
        ))
        return tempArr;
    }


    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    let centerStyle = {
        textAlign: 'center',
    }

    return (
        <>
            {currUser !== null && currUser.type === "Recruiter" && currStudent !== null ?
                <>
                    <h1 style={h1Style}>{currStudent.first_name + " " + currStudent.last_name}</h1>
                    <h3 style={centerStyle}>{currStudent.email}</h3>
                    <h3 style={centerStyle}>{capitalize(currStudent.class_standing)}</h3>
                    <h5 style={centerStyle}>{skillTagConvert(currStudent.skill_tags).join(", ")}</h5>
                    
                    {currStudent.resume !== null ?
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                                <Viewer fileUrl={'http://127.0.0.1:8000' + currStudent.resume}
                                    plugins={[defaultLayout]}
                                    defaultScale={SpecialZoomLevel.ActualSize} />
                         </Worker> 

                        :
                        <h5 style={centerStyle}>Student has not uploaded a resume</h5>
                    }
                </>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </>
    );
}