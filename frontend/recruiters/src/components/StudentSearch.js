import { useEffect, useState } from 'react';
import {Button, Card, CardGroup } from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Alert} from 'react-bootstrap';

export default function StudentSearch({match, currUser}) {
    const [students, setStudents] = useState([]);
    const [classSearch, setClassSearch] = useState([]);
    const [skillSearch, setSkillSearch] = useState([]);

    useEffect(() => {
        const skills = match.params.skills;
        const classes = match.params.classes;

        var skillArr = []
        skillArr = skills.split('-');

        var classesArr = []
        classesArr = classes.split('-');

        setClassSearch(classesArr)
        setSkillSearch(skillArr)

        if (skills === null) {
            skillArr = null
        }

        if(classes === null) {
            classesArr = null
        }

        let isUnmount = false;
        const data = localStorage.getItem('currUser');
        var tempUser = null

        if(data) {
            tempUser = JSON.parse(data);
        }

        if(tempUser !== null) {
            const searchPackage = {
                "skills": skillArr,
                "classes": classesArr,
                "Type": tempUser.type
            }
            fetch('http://localhost:8000/api/search/', { 
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(searchPackage)
            })
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                }
                else {
                    return null;
                }
            })
            .then((jsonData) => {
                if(!isUnmount && jsonData !== null) {
                    setStudents(jsonData);
                }
            })
        }

        return () => {
            isUnmount = true;
        }

    }, [match.params.classes, match.params.skills])


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
        marginBottom: 25
    }

    let btnStyle = {
        backgroundColor: "#E95420",
        borderColor: "#E95420",
        marginLeft:"1%",
        marginTop:"1%"
    }

    let paddingStyle = {
        paddingLeft:"1%",
        paddingRight:"1%"
    }

    return (
        <>
            {currUser !== null && currUser.type === "Recruiter"?
                <div>
                    {students.length > 0 ? 
                    <>
                        <Button style={btnStyle} className="btn btn-primary mb-2" href="/find-students">Back to Search</Button>
                        <div style={paddingStyle}>
                            <h1 style={h1Style}>Search Results</h1>

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
                    </>
                    :
                    <>
                        <Button style={btnStyle} className="btn btn-primary mb-2" href="/find-students">Back to Search</Button>
                        <Alert variant="danger">
                        <Alert.Heading>No students found with criteria</Alert.Heading>
                            <p>
                                Classes: {classSearch.join(" or ")} <br/>
                                Skills: {skillSearch.join(", ")}
                            </p>
                        </Alert>
                    </>
                }
                </div>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </>
    )
}