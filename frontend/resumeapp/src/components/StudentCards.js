import { Card, Row, Col } from 'react-bootstrap';
import {Link} from 'react-router-dom';

export default function StudentCards ({currUser, students}) {

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const skillTagConvert = (skillTags) => {
        var tempArr = []
        skillTags.map((tag) => (
            tempArr.push(tag.name)
        ))
        return tempArr;
    }

    // <---------------- STYLING ---------------->
    let h1Style = {
        textAlign: 'center',
        marginTop: 50,
        marginBottom: 25
    }

    return (
        <div >
            {currUser !== null && currUser.type === "Administrator"?
                <div>
                    <Row>
                    {students.map((stud, idx) => (
                            <Col xs={4}>
                                <Card
                                bg="light"
                                key={idx}
                                text="dark"
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