import React, {useEffect, useState, useRef} from 'react';
import { Button, Card, CardGroup, Modal, InputGroup, FormControl, Alert, Form } from 'react-bootstrap';

export default function AllSkillTags({currUser}) {
    const [skillTags, setSkillTags] = useState([]);
    const [show, setShow] = useState(false);
    const [deleteTag, setDeleteTag] = useState(null);
    const [message, setMessage] = useState("");
    const [isValid, setIsValid] = useState(true);

    const newTagRef = useRef();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        let isUnmount = false;

        fetch('http://localhost:8000/api/skill_tags/')
        .then((res) => {
            return res.json();
        })
        .then((jsonData) => {
            if(!isUnmount) {
                var tempArr = []
                for (var tag in jsonData) {
                    tempArr.push(tag);
                }
                setSkillTags(tempArr);
            }
        })

        return () => {
            isUnmount = true;
        }
    }, [])

    const addTags = async () => {
        setIsValid(true);
        setMessage("");

        var newTags = newTagRef.current.value.split(",").map(function(item) {
            return item.trim();
        });

        if (newTags[0] === "") {
            return;
        }
        
        const tagPackage = {
            "type": currUser.type,
            "tags": newTags
        }

        const res = await fetch('http://localhost:8000/api/admin-add-tags/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(tagPackage)
        })

        const jsonData = await res.json();

        const already_exist = jsonData.already_exist;

        if (already_exist.length > 0) {
            setIsValid(false)
            const exists_string = already_exist.join(", ")
            setMessage("The following skill tags already exist: " + exists_string);
        }

        const res2 = await fetch('http://localhost:8000/api/skill_tags/')
        const json2 = await res2.json();
        var tempArr = []
        for (var tag in json2) {
            tempArr.push(tag);
        }
        setSkillTags(tempArr);

        newTagRef.current.value = null;
    }


    const openDeleteBox = (tagToDelete) => {
        setDeleteTag(tagToDelete);
        handleShow();
    }

    const removeTag = async () => {

        const deletePackage = {
            "type": currUser.type,
            "deleteTag": deleteTag
        }

        await fetch('http://localhost:8000/api/admin-delete-tag/', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(deletePackage)
        })

        const res2 = await fetch('http://localhost:8000/api/skill_tags/')
        const json2 = await res2.json();
        var tempArr = []
        for (var tag in json2) {
            tempArr.push(tag);
        }
        setSkillTags(tempArr);

        handleClose();
    }

    const searchChange = async (e) => {
        const searchTag = {
            "type": currUser.type,
            "searchTag": e.target.value
        }

        const res = await fetch('http://localhost:8000/api/skill-tag-search/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(searchTag)
        })

        const jsonData = await res.json();
        var tempArr = []
        for (var tag in jsonData) {
            tempArr.push(tag);
        }
        setSkillTags(tempArr);
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
                <>
                    {message !== "" && !isValid ?
                        <Alert variant="danger" style={{marginLeft: 10, marginTop: 25}}>{message}</Alert>
                        :
                        <></>
                    }
                    <InputGroup className="mb-3" style={{width: "50rem", marginLeft: 10, marginTop: 25}}>
                        <FormControl
                            placeholder="Enter new skill tags in a comma seperated list..."
                            aria-label="New Tag"
                            aria-describedby="basic-addon2"
                            ref={newTagRef}
                        />
                        <Button variant="primary" id="button-addon2" onClick={addTags}>
                            Add Tags
                        </Button>
                    </InputGroup>
                    <Form>
                        <div className="form-group" style={{width: "50rem", marginLeft: 10}}>
                            <input type="text" className="form-control" placeholder="Search skill tags" onChange={searchChange}/>
                        </div>
                    </Form>
                    <div className="outerTags">
                        {skillTags.map((tag, idx) => (
                            <CardGroup>
                                <Card
                                    bg="light"
                                    key={idx}
                                    text="dark"
                                    style={{ width: "15rem" }}
                                    className="mb-2">
                                    <Card.Body style={{textAlign: 'center'}}>
                                        <Card.Title>{tag}</Card.Title>
                                        <Button variant="danger" onClick={() => openDeleteBox(tag)}>Delete</Button>
                                    </Card.Body>
                                </Card>
                            </CardGroup>
                            ))
                        } 
                    </div>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Are You Sure?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Delete tag {deleteTag}?</Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={removeTag}>
                            Delete
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }

            
        </div>
    )
}