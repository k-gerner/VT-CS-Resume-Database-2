import React, {useEffect, useState} from 'react';
import Select from 'react-select';
import StudentSkillTag from './StudentSkillTag';
import {Button} from 'react-bootstrap';
import '../main.css'

export default function StudentInfo({currUser}) {
    const [student, setStudent] = useState(null);
    const [studentSkillTags, setStudentSkillTags] = useState(null);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [skillOptions, setSkillOptions] = useState(null);

    const [counter, setCounter] = useState(0);

    useEffect(() => {
        let isUnmount = false;
        const arr = currUser.username.split("@");

        // console.log(studentSkillTags);

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
                    <h3 className="marStyleTop">Name: <span className="tabName">{student.first_name + " " + student.last_name}</span></h3>
                    <h3 className="marStyle">PID: <span className="tabPID">{student.pid}</span></h3>
                    <h3 className="marStyle">Email: <span className="tabEmailClass">{student.email}</span></h3>
                    <h3 className="marStyle">Class: <span className="tabEmailClass">{capitalize(student.class_standing)}</span></h3>
                    <br/>
                    <div className="outerTags">
                    {
                        studentSkillTags !== null ?
                        studentSkillTags.map((SkillTag) => (
                            <div className="innerTags"><StudentSkillTag currUser={currUser} counter={counter} setCounter={setCounter} SkillTagName={SkillTag} studentSkillTags={studentSkillTags} setStudentSkillTags={setStudentSkillTags} /></div>
                        ))
                        :
                        <>
                        </>
                    }
                    </div>
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
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={addTags}>Add Skills</Button> 
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={clearFilters}>Clear</Button>
                </div>
                :
                <>
                </>
            }
        </>
    )
}