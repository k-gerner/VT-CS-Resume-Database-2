import { FileUploader } from "react-drag-drop-files";
import React, {useEffect, useState} from 'react';
import {Button, Alert} from 'react-bootstrap';
import './../main.css'
import AddSkillTag from './AddSkillTag';

const fileTypes = ["PDF"];

export default function ResumeUpload({currUser}) {
	const [file, setFile] = useState(null);
	const [suggestedTags, setSuggestedTags] = useState([]);
	const [success, setSuccess] = useState(false);
	const [alertText, setAlertText] = useState("orginial")//useState("Suggestions for skill tags that you have not already listed on your profile have been listed below. Click the '+' to add them!")
	
	const handleChange = file => {
		setFile(file);
	};

	const upload_file_to_backend = () => {
		if (file === null) {
			return;
		}

		var formData = new FormData();

		formData.append('resume_file', file);
		formData.append('pid', currUser.username.split("@")[0]);

		fetch('http://localhost:8000/api/upload-resume/', { 
			method: 'POST',
			body: formData
		})
		.then((res) => {
			if(res.status === 200) {
				setSuccess(true)
			}
			return res.json();
		})
		.then((jsonData) => {
			setSuggestedTags(jsonData.suggested_tags)
			console.log(suggestedTags)
		})
		setFile(null)
	}

	useEffect(() => {
		if(suggestedTags.length === 0){
			console.log("# tags was 0")
			setAlertText("No new skill tags were found in your resume.")
		}
		else{
			console.log("# tags was MORE than 0")
			setAlertText("Suggestions for skill tags that you have not already listed on your profile have been listed below. Click the '+' to add them!")
		}
	}, [suggestedTags])

	// <---------------- STYLING ---------------->
	let btnStyle = {
	    marginRight: 10,
	    backgroundColor: "#E95420",
	    borderColor: "#E95420",
	}

  return (
  	<div className="center">
	    <FileUploader 
	        handleChange={handleChange} 
	        name="file" 
	        types={fileTypes} 
	    />
		<br/>
	    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={upload_file_to_backend} disabled={file===null}>Submit</Button> 
		<br/>
		{ success &&
			<Alert key="alert1" variant="success">
				<Alert.Heading>Resume uploaded successfully!</Alert.Heading>
				<p>
					{alertText}
			 	</p>
			</Alert>
		}
		<br/>
		{suggestedTags.length > 0 &&
			<div key="outerTags" className="outerTags">
				{ suggestedTags.map((tag) => 
					<div key={tag} className="innerTags"><AddSkillTag addCheck={true} currUser={currUser} skillTagName={tag} /></div>
				)
				}
			</div>
		}
    </div>
  );
}