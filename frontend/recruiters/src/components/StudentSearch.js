import { useEffect, useState } from 'react';
import {Button } from 'react-bootstrap';
import {Alert} from 'react-bootstrap';
import StudentCards from './StudentCards';

export default function StudentSearch({match, currUser}) {
    const [students, setStudents] = useState([]);
    const [classSearch, setClassSearch] = useState([]);
    const [skillSearch, setSkillSearch] = useState([]);
    const [loading, setLoading] = useState(true);
    const [percentMatches, setPercentMatches] = useState({})
    const [exactMatches, setExactMatches] = useState(false)

    useEffect(() => {
        const skills = match.params.skills;
        const classes = match.params.classes;
        const exact_matches = match.params.exact_matches === "true";

        var skillArr = []
        skillArr = skills.split('-');

        var classesArr = []
        classesArr = classes.split('-');

        setClassSearch(classesArr)
        setSkillSearch(skillArr)
        setExactMatches(exact_matches)

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
                "Type": tempUser.type,
                "exact_matches": exact_matches
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
                    console.log(jsonData['pid_num_matches'])
                    setStudents(jsonData['student_data']);
                    setPercentMatches(jsonData['pid_num_matches'])
                    setLoading(false);
                }
            })
        }

        return () => {
            isUnmount = true;
        }

    }, [match.params.classes, match.params.skills])


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
                    {students.length > 0 || loading ? 
                    <>
                        <Button style={btnStyle} className="btn btn-primary mb-2" href="/find-students">Back to Search</Button>
                        <div style={paddingStyle}>
                            <h1 style={h1Style}>Search Results</h1>

                            <StudentCards
                                currUser={currUser}
                                students={students}
                                percentMatches={percentMatches}
                            />
                        </div>
                    </>
                    :
                    <>
                        <Button style={btnStyle} className="btn btn-primary mb-2" href="/find-students">Back to Search</Button>
                        <Alert variant="danger">
                        <Alert.Heading>No students found with criteria</Alert.Heading>
                            <p>
                                Classes: {classSearch.join(" or ") === 'null' ? "(N/A)" : classSearch.join(" or ")} <br/>
                                Skills: {skillSearch.join(", ") === 'null' ? "(N/A)" : skillSearch.join(", ")}
                                {exactMatches && <div><br/>(exact matches only)</div>}
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