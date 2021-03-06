import {Alert, ListGroup} from 'react-bootstrap';
import '../main.css'

export default function AdminStudentInfo({currStudent}) {
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

    const capitalizeJobDescription = (str) => {
        if(str.toUpperCase().includes(" OR ")){
            return "Internship OR Full-time" // spooky hard-coding
        }
        else{
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
    }

    return (
        <>
            {currStudent !== null ?
                <div>
                    {/* https://react-bootstrap.github.io/components/list-group/ <-- we can look here for the editable class button implementation*/}
                    <ListGroup as="ol">
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Name</div>
                                {currStudent.first_name + " " + currStudent.last_name + " (" + currStudent.pid + ")"}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Email</div>
                                {currStudent.email}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Seeking</div>
                                {capitalizeJobDescription(currStudent.job_description)}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Class</div>
                                {capitalize(currStudent.class_standing)}
                            </div>
                        </ListGroup.Item>
                        <ListGroup.Item
                            as="li"
                            className="d-flex justify-content-between align-items-start"
                        >
                            <div className="ms-2 me-auto">
                            <div className="fw-bold">Skills</div>
                                {
                                    currStudent.skill_tags !== null ?
                                        currStudent.skill_tags.length === 0 ?
                                            <Alert key='no_tags_alert' variant='secondary'>
                                                This student has not selected any skills yet.
                                            </Alert>
                                            :
                                            skillTagConvert(currStudent.skill_tags).join(", ")
                                        :
                                        <>
                                        </>
                                }
                            </div>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                :
                <>
                </>
            }
        </>
    )
}