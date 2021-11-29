import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {Button} from 'react-bootstrap';
import StudentCards from './StudentCards';

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

        const skillsStorage = localStorage.getItem('selectedSkills');
        if(skillsStorage && skillsStorage !== "null") {
            var tempSkills = [];
            skillsStorage.split("-").map((tag) => (
                tempSkills.push({
                    value: tag, label: tag
                })
            ))
            setSelectedSkills(tempSkills);
        }

        const classStorage = localStorage.getItem('selectedClasses');
        if(classStorage && classStorage !== "null") {
            var tempClasses = [];
            classStorage.split("-").map((classS) => (
                tempClasses.push({
                    value: classS, label: classS
                })
            ))
            setSelectedClasses(tempClasses);
        }

        return () => {
            isUnmount = true;
        }

    }, [])

    const skillSelect = (selectedSkills) => {
        if(selectedSkills.length <= 0) {
            setSelectedSkills(null);
            localStorage.setItem('selectedSkills', null);
            return;
        }
        var tempSkills = "";
        selectedSkills.map((skill) => (
            tempSkills += skill['value'] + "-"
        ))
        localStorage.setItem('selectedSkills', tempSkills.substring(0, tempSkills.length - 1));
        setSelectedSkills(selectedSkills);
        
    }

    const classSelect = (selectedClasses) => {
        if(selectedClasses.length <= 0) {
            setSelectedClasses(null);
            localStorage.setItem('selectedClasses', null);
            return;
        }
        var tempClasses = "";
        selectedClasses.map((skill) => (
            tempClasses += skill['value'] + "-"
        ))
        localStorage.setItem('selectedClasses', tempClasses.substring(0, tempClasses.length - 1));
        setSelectedClasses(selectedClasses);
    }

    const clearFilters = () => {
        setSelectedSkills(null);
        localStorage.setItem('selectedSkills', null);
        setSelectedClasses(null);
        localStorage.setItem('selectedClasses', null);
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
            var tempClasses = "";
            selectedClasses.map((skill) => (
                tempClasses += skill['value'] + "-"
            ))
            return tempClasses.substring(0, tempClasses.length - 1);
        }
        else {
            return null;
        }
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

                    <label>Select Desired Class Levels:</label>
                    <Select 
                        value={selectedClasses}
                        onChange={classSelect}
                        options={classOptions}
                        isMulti={true}
                        isSearchable={true}
                    />

                    <br/>

                    <label>Select Necessary Skills:</label>
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

                    <StudentCards
                        currUser={currUser}
                        students={students}
                    />

                </div>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </div>
    );
}