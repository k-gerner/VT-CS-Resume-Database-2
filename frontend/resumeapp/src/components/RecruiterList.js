import React, {useEffect, useState} from 'react';
import { Button, Card, CardGroup, Modal } from 'react-bootstrap';

export default function RecruiterList({currUser}) {
    const [recruiters, setRecruiters] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteRec, setDeleteRec] = useState(null);

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
            fetch('http://localhost:8000/api/get-all-recruiters/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"Type": tempUser.type})
            })
            .then((res) => {
                return res.json();
            })
            .then((jsonData) => {
                if(!isUnmount) {
                    setRecruiters(jsonData);
                }
            })
        }

        return () => {
            isUnmount = true;
        }
    }, [])


    const openDeleteBox = (toRemoveRecruiterUsername) => {
        setDeleteRec(toRemoveRecruiterUsername);
        handleShow();
    }


    const removeRecruiter = async () => {
        const toRemovePackage = {
            "type": currUser.type,
            "recUsername": deleteRec
        }

        await fetch('http://localhost:8000/api/delete-recruiter/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(toRemovePackage)
        })

        const res = await fetch('http://localhost:8000/api/get-all-recruiters/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"Type": currUser.type})
        })

        const jsonData = await res.json();
        setRecruiters(jsonData);


        handleClose();
    }


    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    return (
        <div>
            {currUser !== null && currUser.type === "Administrator"?
                <div>
                    {recruiters.map((rec, idx) => (
                        <CardGroup>
                            <Card
                                bg="light"
                                key={idx}
                                text="dark"
                                style={{ width: "18rem" }}
                                className="mb-2">
                                <Card.Header style={{textAlign: 'center'}}>{rec.user.username}</Card.Header>
                                <Card.Body style={{textAlign: 'center'}}>
                                    <Card.Title>{rec.first_name + " " + rec.last_name}</Card.Title>
                                    <Card.Text>{rec.company_name}</Card.Text>
                                    <Button variant="danger" onClick={() => openDeleteBox(rec.user.username)}>Delete</Button>
                                </Card.Body>
                            </Card>
                        </CardGroup>
                        ))
                    } 

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Are You Sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Delete recruiter {deleteRec}?</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={removeRecruiter}>
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

            
        </div>
    )
}