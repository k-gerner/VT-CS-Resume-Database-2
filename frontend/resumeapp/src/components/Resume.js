import React, {useEffect, useState} from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import {Toast, Button, Modal, Alert} from 'react-bootstrap';
import '../main.css'
import { FileUploader } from "react-drag-drop-files";
import AddSkillTag from './AddSkillTag';



const fileTypes = ["PDF"];

export default function Resume({currUser}) {
    const defaultLayout = defaultLayoutPlugin();

    const [file, setFile] = useState(null);
    const [student, setStudent] = useState(null);
    const [show, setShow] = useState(false);
    const [suggestedTags, setSuggestedTags] = useState([]);
	const [success, setSuccess] = useState(false);
    const [alertText, setAlertText] = useState("orginial")

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => setShow(true);

    const handleChange = file => {
		setFile(file);
	};

    useEffect(() => {
        let isUnmount = false;
        const arr = currUser.username.split("@");

        console.log("Rerendering")

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

    useEffect(() => {
		if(suggestedTags.length === 0){
			setAlertText("No new skill tags were found in your resume.")
		}
		else{
			setAlertText("Suggestions for skill tags that you have not already listed on your profile have been listed below. Click the '+' to add them!")
		}
	}, [suggestedTags])

    const upload_file_to_backend = () => {
		if (file === null) {
			return;
		}

		var formData = new FormData();

		formData.append('resume_file', file);
		formData.append('pid', currUser.username.split("@")[0]);

		fetch('http://localhost:8000/api/upload-resume/', { 
			method: 'POST',
			body: formData
		})
		.then((res) => {
			if(res.status === 200) {
				setSuccess(true)
			}
			return res.json();
		})
		.then((jsonData) => {
			setSuggestedTags(jsonData.suggested_tags)
            handleShow();
		})
		setFile(null)
	}


    // <---------------- STYLING ---------------->

    let btnStyle = {
        backgroundColor: "#E95420",
        borderColor: "#E95420",
        float: "right"
    }


    return (
        <>
            {student !== null ?
                student.resume !== null ?
                    <>
                        <div style={{width: "70%", height: "50%", float:"left", marginBottom: 10}}>
                            <FileUploader 
                                handleChange={handleChange} 
                                name="file" 
                                types={fileTypes} 
                                
                            />
                        </div>
                        <Button style={btnStyle} className="btn btn-primary mb-2" onClick={upload_file_to_backend} disabled={file === null}>Upload Resume</Button>
                        <br/>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js">
                            <Viewer fileUrl={'http://127.0.0.1:8000' + student.resume}
                                plugins={[defaultLayout]}
                                defaultScale={SpecialZoomLevel.ActualSize} />
                        </Worker>
                        {/* <Button style={btnStyle} className="btn btn-primary mb-2">Add Resume</Button> */}
                    </>
                    :
                    <div className="d-flex justify-content-center flex-row" style={{marginTop:'15%'}}>
                        <Toast>
                            <Toast.Header closeButton={false}>
                                <strong className="me-auto">VT CS</strong>
                                <small>{new Date().toLocaleString("en-US", { month: "long", day:"2-digit" })}</small>
                            </Toast.Header>
                            <Toast.Body>You have not yet uploaded a resume. It will appear here once you do. Your profile will not be visible by recruiters until you upload a resume.
                            <div style={{width: "70%", height: "50%", float:"left", marginBottom: 10, marginTop: 10}}>
                            <FileUploader 
                                handleChange={handleChange} 
                                name="file" 
                                types={fileTypes} 
                                
                            />
                            </div>
                            <Button style={btnStyle} className="btn btn-primary mb-2" onClick={upload_file_to_backend} disabled={file === null}>Upload Resume</Button>
                            </Toast.Body>
                        </Toast>
                    </div>
                :
                <>
                </>
            }
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                {/* <Modal.Title>Are You Sure?</Modal.Title> */}
                </Modal.Header>
                <Modal.Body>
                { success &&
                    <Alert key="alert1" variant="success">
                        <Alert.Heading>Resume uploaded successfully!</Alert.Heading>
                        <p>
                            {alertText}
                        </p>
                    </Alert>
                }
                <br/>
                {suggestedTags.length > 0 &&
                    <div key="outerTags" className="outerTags">
                        { suggestedTags.map((tag) => 
                            <div key={tag} className="innerTags"><AddSkillTag addCheck={true} currUser={currUser} skillTagName={tag} /></div>
                        )
                        }
                    </div>
                }
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} href="/profile">
                    Done
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}