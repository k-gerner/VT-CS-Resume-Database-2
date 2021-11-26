import React, {useEffect, useState} from 'react';
import { Card, CardGroup } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {Button} from 'react-bootstrap';

export default function StudentList ({currUser}) {
    const [students, setStudents] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [skillOptions, setSkillOptions] = useState(null);
    const [selectedClasses, setSelectedClasses] = useState(null);

    const classOptions = [
        {value: 'Freshman', label: 'Freshman'},
        {value: 'Sophomore', label: 'Sophomore'},
        {value: 'Junior', label: 'Junior'},
        {value: 'Senior', label: 'Senior'},
        {value: 'Master\'s', label: 'Master\'s'},
        {value: 'PhD', label: 'PhD'}
    ]


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

            fetch('http://localhost:8000/api/skill_tags/')
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
            
        }

        return () => {
            isUnmount = true;
        }

    }, [])

    const skillSelect = (selectedSkills) => {
        if(selectedSkills.length <= 0) {
            setSelectedSkills(null);
            return;
        }
        setSelectedSkills(selectedSkills);
        
    }

    const classSelect = (selectedClasses) => {
        if(selectedClasses.length <= 0) {
            setSelectedClasses(null);
            return;
        }
        setSelectedClasses(selectedClasses);
    }

    const clearFilters = () => {
        setSelectedSkills(null);
        setSelectedClasses(null);
    }

    const formatSkillSearchPackage = () => {
        if(selectedSkills !== null) {
            var tempSkills = "";
            selectedSkills.map((skill) => (
                tempSkills += skill['value'] + "-"
            ))
            return tempSkills.substring(0, tempSkills.length - 1);
        }
        else {
            return null;
        }
    }

    const formatClassSearchPackage = () => {
        if(selectedClasses !== null) {
            var tempSkills = "";
            selectedClasses.map((skill) => (
                tempSkills += skill['value'] + "-"
            ))
            return tempSkills.substring(0, tempSkills.length - 1);
        }
        else {
            return null;
        }
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

    let btnStyle = {
        marginRight: 10,
        backgroundColor: "#E95420",
        borderColor: "#E95420"
    }

    let paddingStyle = {
        paddingLeft:"1%",
        paddingRight:"1%"
    }

    return (
        <div style={paddingStyle}>
            {currUser !== null && currUser.type === "Recruiter"?
                <div>
                    <br/>

                    <label>Select Class:</label>
                    <Select 
                        value={selectedClasses}
                        onChange={classSelect}
                        options={classOptions}
                        isMulti={true}
                        isSearchable={true}
                    />

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

                    <Button style={btnStyle} className="btn btn-primary mb-2" disabled={selectedSkills === null && selectedClasses === null}>
                        <Link to={`/student-search/${formatSkillSearchPackage()}/${formatClassSearchPackage()}`}
                            style={{ textDecoration: 'none', color: 'white'}}>
                            Search
                        </Link>
                    </Button> 
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={clearFilters} disabled={selectedSkills === null && selectedClasses === null}>Clear</Button>

                    <br/>

                    {students.map((stud, idx) => (
                        <CardGroup>
                            <Card
                                bg="light"
                                key={idx}
                                text="dark"
                                style={{ width: "18rem" }}
                                className="mb-2">
                                
                                <Card.Header style={{textAlign: 'center'}}>{stud.pid}</Card.Header>
                                <Card.Body style={{textAlign: 'center'}}>
                                    <Card.Title><Link to={`/student/${stud.pid}`}>{stud.first_name + " " + stud.last_name}</Link></Card.Title>
                                    <Card.Text>{capitalize(stud.class_standing)}</Card.Text>
                                </Card.Body>
                                <Card.Footer style={{textAlign: 'center'}}>
                                    {skillTagConvert(stud.skill_tags).join(", ")}
                                </Card.Footer>
                            </Card>

                        </CardGroup>
                    ))
                    } 
                </div>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </div>
    );
}