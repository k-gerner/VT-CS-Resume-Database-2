import StudentInfo from './StudentInfo';
import Resume from './Resume';
import './../main.css'

export default function Profile({currUser}) {


    return (
        <>
            {currUser !== null && currUser.type === "Student" ?
                <div className="outer">
                    <div className="inner">
                        <StudentInfo currUser={currUser} />
                    </div>
                    <div className="inner">
                        <Resume currUser={currUser} />
                    </div>
                </ div>
            :
                <h1 className="h1Style">You must be logged in as a student to access this page</h1>
            }
        </>
    )
}