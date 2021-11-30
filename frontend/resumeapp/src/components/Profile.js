import StudentInfo from './StudentInfo';
import Resume from './Resume';
import './../main.css'
import {Alert} from 'react-bootstrap';

export default function Profile({currUser}) {

    return (
        <>
            {currUser !== null && currUser.type === "Student" ?
                <>
                    <div className="outerProfile">
                        <div className="profileDetails">
                            <StudentInfo currUser={currUser} />
                        </div>
                        <div className="resumeView">
                            <Resume currUser={currUser} />
                        </div>
                    </ div>
                </>
            :
            <Alert variant="danger">
                <Alert.Heading>Something went wrong...</Alert.Heading>
                <p>
                You must be logged in as a student to access this page.
                </p>
            </Alert>
            }
        </>
    )
}