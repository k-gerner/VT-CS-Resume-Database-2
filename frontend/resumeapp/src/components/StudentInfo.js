import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import StudentSkillTag from './StudentSkillTag';
import {Button, ListGroup, Alert, Modal} from 'react-bootstrap';
import '../main.css'

export default function StudentInfo({currUser}) {
    const [student, setStudent] = useState(null);
    const [studentSkillTags, setStudentSkillTags] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [skillOptions, setSkillOptions] = useState(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const classOptions = [
        {value: 'Freshman', label: 'Freshman'},
        {value: 'Sophomore', label: 'Sophomore'},
        {value: 'Junior', label: 'Junior'},
        {value: 'Senior', label: 'Senior'},
        {value: 'Master\'s', label: 'Master\'s'},
        {value: 'PhD', label: 'PhD'}
    ]

    const jobDescriptionOptions = [
        {value: 'Internship', label: 'Internship'},
        {value: 'Full-time', label: 'Full-time'},
        {value: 'Internship OR Full-time', label: 'Internship OR Full-time'},
        {value: 'Not looking for work', label: 'Not looking for work'}
    ]

    const [counter, setCounter] = useState(0);

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
                skillTagConvert(jsonData);
            }
        })

        fetch('http://localhost:8000/api/skill_tags/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"pid" : arr[0]})
        })
        .then((res) => {
            return res.json();
        })
        .then((jsonData) => {
            if(!isUnmount) {
                var tempArr = [];
                for (var tag in jsonData) {
                    tempArr.push({
                        value: tag, label: tag
                    });
                }
                setSkillOptions(tempArr);
            }
        })

        return () => {
            isUnmount = true;
        }

    }, [counter, currUser.username])


    const skillSelect = (selectedSkills) => {
        if(selectedSkills.length <= 0) {
            setSelectedSkills(null);
            return;
        }
        setSelectedSkills(selectedSkills);
        
    }

    const classSelect = async (selectedClass) => {
        const changePackage = {
            "pid": student.pid,
            "class": selectedClass.value,
        }

        await fetch('http://localhost:8000/api/update-student-class/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changePackage)
        })
    }

    const jobDescriptionSelect = async (description) => {
        const changePackage = {
            "pid": student.pid,
            "job_description": description.value,
        }

        if (description.value === "Not looking for work") {
            // console.log(description.value);
            handleShow();
        }

        await fetch('http://localhost:8000/api/update-student-job-description/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changePackage)
        })
    }

    const clearFilters = () => {
        setSelectedSkills(null);
    }

    const addTags = () => {
        if (selectedSkills !== null) {
            var requestArr = [];
            selectedSkills.map((newSkill) => (
                requestArr.push(newSkill.value)
            ))

            const requestPacakge = {
                "pid": currUser.username.split("@")[0],
                "tags": requestArr,
            }

            fetch('http://localhost:8000/api/add-tags-student/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestPacakge)
            })
            .then(() => {
                setCounter(counter + 1);
                selectedSkills.map((newSkill) => (
                    setStudentSkillTags(prevTags => {
                        return [...prevTags, newSkill.value];
                    })
                ))
            })

            
            setSelectedSkills(null);
        }
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

    const skillTagConvert = (jsonData) => {
        var tempArr = []
        jsonData.skill_tags.map((tag) => (
            tempArr.push(tag.name)
        ))
        setStudentSkillTags(tempArr);

    }

    // <---------------- STYLING ---------------->
    
    let btnStyle = {
        marginRight: 10,
        marginLeft: 10,
        paddingLeft: 10,
        backgroundColor: "#E95420",
        borderColor: "#E95420",
    }

    return (
        <>
            {student !== null ?
                <div>
                    {/* https://react-bootstrap.github.io/components/list-group/ <-- we can look here for the editable class button implementation*/}
                    <ListGroup as="ol">
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Name</div>
                                {student.first_name + " " + student.last_name + " (" + student.pid + ")"}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Email</div>
                                {student.email}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold" style={{width: '200px'}}>Seeking</div>
                                <Select 
                                    menuPortalTarget={document.body} 
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    defaultValue={{value: capitalizeJobDescription(student.job_description), label: capitalizeJobDescription(student.job_description)}}
                                    onChange={jobDescriptionSelect}
                                    options={jobDescriptionOptions}
                                    isSearchable={true}
                                />
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold" style={{width: '150px'}}>Class</div>
                                <Select 
                                    menuPortalTarget={document.body} 
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    defaultValue={{value: capitalize(student.class_standing), label: capitalize(student.class_standing)}}
                                    onChange={classSelect}
                                    options={classOptions}
                                    isSearchable={true}
                                />
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Skills</div>
                                <div className="outerTags">
                                {
                                    studentSkillTags !== null ?
                                        studentSkillTags.length === 0 ?
                                            <Alert key='no_tags_alert' variant='secondary'>
                                                You have no skill tags selected.
                                            </Alert>
                                            :
                                            studentSkillTags.map((SkillTag) => (
                                                <div className="innerTags"><StudentSkillTag currUser={currUser} counter={counter} setCounter={setCounter} SkillTagName={SkillTag} studentSkillTags={studentSkillTags} setStudentSkillTags={setStudentSkillTags} /></div>
                                            ))
                                        :
                                        <>
                                        </>
                                }
                                </div>
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                    <br/>
                    <label>Select Skill Tags:</label>
                    <Select 
                        value={selectedSkills}
                        onChange={skillSelect}
                        options={skillOptions}
                        isMulti={true}
                        isSearchable={true}
                    />
                    <br/>
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={addTags} disabled={selectedSkills===null}>Add Skills</Button> 
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={clearFilters} disabled={selectedSkills===null}>Clear</Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Body>
                            You selected "Not looking for work". Your profile is now hidden from recruiters.
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Done
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                :
                <>
                </>
            }
        </>
    )
}