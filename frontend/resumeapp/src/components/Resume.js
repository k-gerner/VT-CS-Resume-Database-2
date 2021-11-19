import React, {useEffect, useState} from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '../main.css'

export default function Resume({currUser}) {
    const defaultLayout = defaultLayoutPlugin();

    const [student, setStudent] = useState(null);

    useEffect(() => {
        let isUnmount = false;
        const arr = currUser.username.split("@");

        fetch('http://localhost:8000/api/student-profile-data/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"pid" : arr[0]})
        })
        .then((res) => {
            return res.json();
        })
        .then((jsonData) => {
            if(!isUnmount) {
                setStudent(jsonData);
            }
        })

        return () => {
            isUnmount = true;
        }

    }, [currUser])


    return (
        <>
            {student !== null ?
                student.resume !== null ?
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                        <Viewer fileUrl={'http://127.0.0.1:8000' + student.resume}
                            plugins={[defaultLayout]}
                            defaultScale={SpecialZoomLevel.ActualSize} />
                    </Worker>
                    :
                    <h1 className="h1Style">You have not uploaded a resume yet</h1>
                :
                <>
                </>
            }
        </>
    )
}