import { Card, Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function StudentCards ({currUser, students, percentMatches}) {

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const capitalizeJobDescription = (str) => {
        if(str.includes(" ")){
            return "Internship OR Full-time" // spooky hard-coding
        }
        else{
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
    }

    const skillTagConvert = (skillTags) => {
        var tempArr = []
        skillTags.map((tag) => (
            tempArr.push(tag.name)
        ))
        return tempArr;
    }

    const getStyleColor = (percent) => {
        var colorVal = 1
        if(percent < 100){ // if the percent is 100, we want a bright green. Otherwise, we use the gradient
            colorVal = (0.8 - (100-percent)/100)
        }
        var hue = (colorVal * 135 - 15).toString(10);
        return ["hsl(", hue, ",90%,50%)"].join("");
    }

    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    return (
        <div >
            {currUser !== null && currUser.type === "Recruiter"?
                <div>
                    <Row>
                    {students.map((stud, idx) => (
                            <Col xs={4} key={stud.pid}>
                                <Card
                                bg="light"
                                key={idx}
                                text="dark"
                                className="mb-2">
                                
                                <Card.Header style={{textAlign:'center', color:Object.keys(percentMatches).length > 0 ? 'black' : 'white', backgroundColor: Object.keys(percentMatches).length > 0 ? getStyleColor(percentMatches[stud.pid]) : '#772953'}}>{Object.keys(percentMatches).length > 0 ? percentMatches[stud.pid] + '% match' : stud.pid}</Card.Header>
                                <Card.Body style={{textAlign: 'center'}}>
                                    <Card.Title><Link to={`/student/${stud.pid}`}>{stud.first_name + " " + stud.last_name}</Link></Card.Title>
                                    <Card.Text>{capitalizeJobDescription(stud.job_description)}</Card.Text>
                                    <Card.Text>{capitalize(stud.class_standing)}</Card.Text>
                                </Card.Body>
                                <Card.Footer style={{textAlign: 'center'}}>
                                    {skillTagConvert(stud.skill_tags).join(", ")}
                                </Card.Footer>
                            </Card>
                            </Col>
                            )
                        )}
                    </Row>

                </div>
                :
                <>
                    <h1 style={h1Style}>You do not have access to this page</h1>
                </>
            }
        </div>
    );
}