import {Button, InputGroup, FormControl} from 'react-bootstrap';
import React, {useState} from 'react';

export default function AddSkillTag({addCheck, currUser, skillTagName}) {
    const [adding, setAdding] = useState(addCheck)

    const addSkillTag = async () => {
        const requestPacakge = {
            "pid": currUser.username.split("@")[0],
            "tag": skillTagName,
        }

        fetch('http://localhost:8000/api/add-single-tag-student/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPacakge)
        })

        
        setAdding(false);
    }

    const removeSkillTag = async () => {
        const requestPacakge = {
            "pid": currUser.username.split("@")[0],
            "tag": skillTagName,
        }

        fetch('http://localhost:8000/api/remove-tag-student/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPacakge)
        })


        setAdding(true);
    }

    return (
        <InputGroup className="mb-3" style={{width: (skillTagName.length * .7) + 4 + "rem", marginLeft: 30}}>
            <FormControl
                placeholder={skillTagName}
                aria-label={skillTagName}
                aria-describedby="basic-addon2"
                disabled
            />
            {adding ?
                <Button variant="primary" onClick={addSkillTag}>
                    +
                </Button>
                :
                <Button variant="success" onClick={removeSkillTag}>
                    {'\u2713'}
                </Button>
            }
            
        </InputGroup>
    )
}