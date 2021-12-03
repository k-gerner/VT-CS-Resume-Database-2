import React, {useEffect, useState, useRef} from 'react';
import { Modal, Button, Form, Card, Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import './../main.css'

export default function StudentList ({currUser}) {
    const [students, setStudents] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteStud, setDeleteStud] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const searchQ = useRef();

    // For pagination
    const [pageNumber, setPageNumber] = useState(0);
    const studentsPerPage = 21;
    const pagesVisited = pageNumber * studentsPerPage;

    const displayStudents = 
        students.slice(pagesVisited, pagesVisited + studentsPerPage);

    const pageCount = Math.ceil(students.length / studentsPerPage);
    const changePage = ({selected}) => {
        setPageNumber(selected);
    }

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

        if (searchQ.current.value === "") {
            const res = await fetch('http://localhost:8000/api/all-students/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"Type": currUser.type})
            })

            const jsonData = await res.json();
            setStudents(jsonData);
        }

        else {
            const pidSearch = {
                "type": currUser.type,
                "searchPID": searchQ.current.value
            }
    
            const res = await fetch('http://localhost:8000/api/pid-search/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(pidSearch)
            })
    
            const jsonData = await res.json();
            setStudents(jsonData);
        }

        handleClose();
    }


    const searchChange = async (e) => {
        // console.log(searchQ.current.value);
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

    const capitalizeJobDescription = (str) => {
        if(str.toUpperCase().includes(" OR ")){
            return "Internship OR Full-time" // spooky hard-coding
        }
        else{
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
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
                            <input type="text" className="form-control" placeholder="Search by PID or Class" ref={searchQ} onChange={searchChange}/>
                        </div>
                    </Form>
                    <br/>
                    <ReactPaginate 
                        previousLabel={"Previous"}
                        nextLabel={"Next"}
                        pageCount={pageCount}
                        onPageChange={changePage}
                        containerClassName={"pageBtns"}
                        previousLinkClassName={"prevBtn"}
                        nextLinkClassName={"nextBtn"}
                        disabledClassName={"pageDisabled"}
                        activeClassName={"pageActive"}
                    />
                    <Row>
                    {displayStudents.map((stud, idx) => (
                            <Col xs={4}>
                                <Card
                                bg="light"
                                key={idx}
                                text="dark"
                                className="mb-2">
                                
                                <Card.Header style={{textAlign: 'center'}}>{stud.pid}</Card.Header>
                                <Card.Body style={{textAlign: 'center'}}>
                                    <Card.Title><Link to={`/student/${stud.pid}`}>{stud.first_name + " " + stud.last_name}</Link></Card.Title>
                                    <Card.Text>{capitalizeJobDescription(stud.job_description)}</Card.Text>
                                    <Card.Text>{capitalize(stud.class_standing)}</Card.Text>
                                    <Button variant="danger" onClick={() => openDeleteBox(stud.pid)}>Delete</Button>
                                </Card.Body>
                                <Card.Footer style={{textAlign: 'center'}}>
                                    {skillTagConvert(stud.skill_tags).join(", ")}
                                </Card.Footer>
                            </Card>
                            </Col>
                            )
                        )}
                    </Row>
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