import React, {useEffect, useState, useRef} from 'react';
import { Button, Card, Modal, Row, Col, Form } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import './../main.css'

export default function RecruiterList({currUser}) {
    const [recruiters, setRecruiters] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteRec, setDeleteRec] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const searchQ = useRef();

    const [pageNumber, setPageNumber] = useState(0);
    const recsPerPage = 9;
    const pagesVisited = pageNumber * recsPerPage;

    const displayRecs = 
        recruiters.slice(pagesVisited, pagesVisited + recsPerPage);

    const pageCount = Math.ceil(recruiters.length / recsPerPage);
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
        if (searchQ.current.value === "") {
            const res = await fetch('http://localhost:8000/api/get-all-recruiters/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({"Type": currUser.type})
            })

            const jsonData = await res.json();
            setRecruiters(jsonData);
        }

        else {
            const companySearch = {
                "type": currUser.type,
                "companyName": searchQ.current.value
            }
    
            const res = await fetch('http://localhost:8000/api/company-search/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(companySearch)
            })
    
            const jsonData = await res.json();
            setRecruiters(jsonData);
        }


        handleClose();
    }

    const searchChange = async (e) => {
        const companySearch = {
            "type": currUser.type,
            "companyName": e.target.value
        }

        const res = await fetch('http://localhost:8000/api/company-search/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(companySearch)
        })

        const jsonData = await res.json();
        setRecruiters(jsonData);
    }


    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    let allPaddingStyle = {
        paddingLeft:"1%",
        paddingRight:"1%",
        paddingTop: "1%",
        paddingBottom: "1%"
    }

    return (
        <div>
            {currUser !== null && currUser.type === "Administrator"?
                <div style={allPaddingStyle}>
                    <Form>
                        <div className="form-group" style={{paddingTop: "1%"}}>
                            <input type="text" className="form-control" placeholder="Search by company" ref={searchQ} onChange={searchChange}/>
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
                        {displayRecs.map((rec, idx) => (
                            <Col xs={4}>
                                <Card
                                    bg="light"
                                    key={idx}
                                    text="dark"
                                    className="mb-2">
                                    <Card.Header style={{textAlign: 'center'}}>{rec.user.username}</Card.Header>
                                    <Card.Body style={{textAlign: 'center'}}>
                                        <Card.Title>{rec.first_name + " " + rec.last_name}</Card.Title>
                                        <Card.Text>{rec.company_name}</Card.Text>
                                        <Button variant="danger" onClick={() => openDeleteBox(rec.user.username)}>Delete</Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                            ))
                        } 
                    </Row>

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