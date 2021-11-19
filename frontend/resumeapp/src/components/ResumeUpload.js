import { FileUploader } from "react-drag-drop-files";
import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import './../main.css'
import AddSkillTag from './AddSkillTag';

const fileTypes = ["PDF"];

export default function ResumeUpload({currUser}) {
	const [file, setFile] = useState(null);
	const [suggestedTags, setSuggestedTags] = useState([]);
	const [success, setSuccess] = useState(false);
	
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

	// <---------------- STYLING ---------------->
	let btnStyle = {
	    marginRight: 10,
	    backgroundColor: "#E95420",
	    borderColor: "#E95420"
	}

  return (
  	<div className="center">
	    <FileUploader 
	        handleChange={handleChange} 
	        name="file" 
	        types={fileTypes} 
	    />
		<br/>
	    <Button style={btnStyle} className="btn btn-primary mb-2" onClick={upload_file_to_backend}>Submit</Button> 
		<br/>
		{ success &&
			<h3>Succesfully uploaded resume</h3>
		}
		<br/>
		{suggestedTags.length > 0 &&
			<div className="outerTags">
				{ suggestedTags.map((tag) => 
					<div className="innerTags"><AddSkillTag addCheck={true} currUser={currUser} skillTagName={tag} /></div>
				)
				}
			</div>
		}
    </div>
  );
}