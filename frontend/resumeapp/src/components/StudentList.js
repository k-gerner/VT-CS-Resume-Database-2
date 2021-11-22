import React, {useEffect, useState} from 'react';
import { Card, CardGroup } from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function StudentList ({currUser}) {
    const [students, setStudents] = useState([]);

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

    return (
        <>
            {currUser !== null && currUser.type === "Administrator"?
                <div>
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
        </>
    );
}