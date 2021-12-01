import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Select from 'react-select';
import {Button, ToggleButton} from 'react-bootstrap';
import StudentCards from './StudentCards';
import ReactPaginate from 'react-paginate';
import './../main.css'

export default function StudentList ({currUser}) {
    const [students, setStudents] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState(null);
    const [skillOptions, setSkillOptions] = useState(null);
    const [selectedClasses, setSelectedClasses] = useState(null);
    const [selectedJobDescriptions, setSelectedJobDescriptions] = useState(null);
    const [showExactMatches, setShowExactMatches] = useState(false);

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
        {value: 'Full-time', label: 'Full-time'}
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
            skillsStorage.split("_").map((tag) => (
                tempSkills.push({
                    value: tag, label: tag
                })
            ))
            setSelectedSkills(tempSkills);
        }

        const classStorage = localStorage.getItem('selectedClasses');
        if(classStorage && classStorage !== "null") {
            var tempClasses = [];
            classStorage.split("_").map((classS) => (
                tempClasses.push({
                    value: classS, label: classS
                })
            ))
            setSelectedClasses(tempClasses);
        }

        const jobDescriptionStorage = localStorage.getItem('selectedJobDescriptions');
        if(jobDescriptionStorage && jobDescriptionStorage !== "null") {
            var tempJobDescriptions = [];
            jobDescriptionStorage.split("_").map((description) => (
                tempJobDescriptions.push({
                    value: description, label: description
                })
            ))
            setSelectedJobDescriptions(tempJobDescriptions);
        }

        const exactMatchesStorage = localStorage.getItem('exactMatches');
        if(exactMatchesStorage && exactMatchesStorage !== "null"){
            setShowExactMatches(exactMatchesStorage === "true");
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
            tempSkills += skill['value'] + "_"
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
            tempClasses += skill['value'] + "_"
        ))
        localStorage.setItem('selectedClasses', tempClasses.substring(0, tempClasses.length - 1));
        setSelectedClasses(selectedClasses);
    }

    const jobDescriptionSelect = (selectedJobDescriptions) => {
        if(selectedJobDescriptions.length <= 0) {
            setSelectedJobDescriptions(null);
            localStorage.setItem('selectedJobDescriptions', null);
            return;
        }
        var tempJobDescriptions = "";
        selectedJobDescriptions.map((description) => (
            tempJobDescriptions += description['value'] + "_"
        ))
        localStorage.setItem('selectedJobDescriptions', tempJobDescriptions.substring(0, tempJobDescriptions.length - 1));
        setSelectedJobDescriptions(selectedJobDescriptions);
    }

    const toggleExactMatches = (checked) => {
        localStorage.setItem('exactMatches', checked);
        setShowExactMatches(checked);
    }

    const clearFilters = () => {
        setSelectedSkills(null);
        localStorage.setItem('selectedSkills', null);
        setSelectedClasses(null);
        localStorage.setItem('selectedClasses', null);
        setSelectedJobDescriptions(null);
        localStorage.setItem('selectedJobDescriptions', null);
    }

    const formatSkillSearchPackage = () => {
        if(selectedSkills !== null) {
            var tempSkills = "";
            selectedSkills.map((skill) => (
                tempSkills += skill['value'] + "_"
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
                tempClasses += skill['value'] + "_"
            ))
            return tempClasses.substring(0, tempClasses.length - 1);
        }
        else {
            return null;
        }
    }

    const formatJobDescriptionPackage = () => {
        if(selectedJobDescriptions !== null && selectedJobDescriptions.length > 0) {
            var tempJobDescriptions = "";
            selectedJobDescriptions.map((description) => (
                tempJobDescriptions += description['value'] + "_"
            ))
            return tempJobDescriptions.substring(0, tempJobDescriptions.length - 1);
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

    let leftPadding = {
        paddingLeft: "0.4em"
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

                    <label>Select Job Description:</label> <label style={{color: "red"}}>*</label>
                    <Select 
                        value={selectedJobDescriptions}
                        onChange={jobDescriptionSelect}
                        options={jobDescriptionOptions}
                        isMulti={true}
                        isSearchable={true}
                    />

                    <br/>

                    <ToggleButton
                        type="checkbox"
                        checked={showExactMatches}
                        value="1"
                        onChange={e => toggleExactMatches(e.currentTarget.checked)}
                        style={btnStyle}
                    >
                        <span style={leftPadding}>Only show students with every selected skill</span>
                    </ToggleButton>

                    <br/><br/>

                    <Button style={btnStyle} className="btn btn-primary mb-2" disabled={selectedJobDescriptions === null || (selectedSkills === null && selectedClasses === null)}>
                        <Link to={`/student-search/${formatSkillSearchPackage()}/${formatClassSearchPackage()}/${formatJobDescriptionPackage()}/${showExactMatches}`}
                            style={{ textDecoration: 'none', color: 'white'}}>
                            Search
                        </Link>
                    </Button> 
                    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={clearFilters} disabled={selectedSkills === null && selectedClasses === null && selectedJobDescriptions === null}>Clear</Button>

                    <br/><br/>

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

                    <br/>

                    <StudentCards
                        currUser={currUser}
                        students={displayStudents}
                        percentMatches={{}}
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