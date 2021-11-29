import React, {useEffect, useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import StudentCards from './StudentCards';

export default function StudentList ({currUser}) {
    const [students, setStudents] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteStud, setDeleteStud] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        let isUnmount = false;
        const data = localStorage.getItem('currUser');
        var tempUser = null

        if(data) {
            tempUser = JSON.parse(data);
        }

        if(tempUser !== null) {
            fetch('http://localhost:8000/api/all-students/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"Type": tempUser.type})
            })
            .then((res) => {
                return res.json();
            })
            .then((jsonData) => {
                if(!isUnmount) {
                    setStudents(jsonData);
                }
            })
        }

        return () => {
            isUnmount = true;
        }

    }, [])

    const openDeleteBox = (toRemoveStudentUsername) => {
        setDeleteStud(toRemoveStudentUsername);
        handleShow();
    }

    const removeStudent = async () => {
        const toRemovePackage = {
            "type": currUser.type,
            "students": [deleteStud],
        }
        
        await fetch('http://localhost:8000/api/delete-students/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toRemovePackage)
        })

        const res = await fetch('http://localhost:8000/api/all-students/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"Type": currUser.type})
        })

        const jsonData = await res.json();
        setStudents(jsonData);

        handleClose();
    }


    const searchChange = async (e) => {
        const pidSearch = {
            "type": currUser.type,
            "searchPID": e.target.value
        }

        const res = await fetch('http://localhost:8000/api/pid-search/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pidSearch)
        })

        const jsonData = await res.json();
        setStudents(jsonData);
    }


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

    let paddingStyle = {
        paddingLeft:"1%",
        paddingRight:"1%"
    }

    return (
        <>
            {currUser !== null && currUser.type === "Administrator" ?
                <div style={paddingStyle}>
                    <Form>
                        <div className="form-group" style={{paddingTop: "1%"}}>
                            <input type="text" className="form-control" placeholder="Search by PID" onChange={searchChange}/>
                        </div>
                    </Form>
                    <br/>
                    <StudentCards
                        currUser={currUser}
                        students={students}
                    />
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Are You Sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Delete student {deleteStud}?</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={removeStudent}>
                            Delete
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </>
    );
}