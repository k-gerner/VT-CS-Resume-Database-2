import {Button, InputGroup, FormControl} from 'react-bootstrap';

export default function StudentSkillTag({currUser, counter, setCounter, SkillTagName, studentSkillTags, setStudentSkillTags}) {
    const removeSkillTag = () => {
        const requestPacakge = {
            "pid": currUser.username.split("@")[0],
            "tag": SkillTagName,
        }
    
        fetch('http://localhost:8000/api/remove-tag-student/', { 
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPacakge)
        })
        .then(() => {
            setCounter(counter - 1);
            setStudentSkillTags(studentSkillTags.filter(function(tag) { 
                return tag !== SkillTagName
            }))
        })
        
        
    }

    return (
        <InputGroup className="mb-3" style={{width: (SkillTagName.length * .7) + 4 + "rem", marginLeft: 30}}>
            <FormControl
                placeholder={SkillTagName}
                aria-label={SkillTagName}
                aria-describedby="basic-addon2"
                disabled
            />
            
            <Button variant="danger" onClick={removeSkillTag}>
                X
            </Button>
            
        </InputGroup>
    )
}