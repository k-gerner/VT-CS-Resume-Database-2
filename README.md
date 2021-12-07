# VT-CS-Resume-Database
This repo contains our Software Engineering Senior Capstone project. The goal of this project is to build an application to connect recruiters with students by allowing students to upload their resumes and list their skills, class, and what type of work they are looking for. Recruiters can search by any of these fields.

### Contributors:
[Sricharan Bachu](https://github.com/charanb2000)  
[Kyle Gerner](https://github.com/k-gerner)  
[Kurt Karpin](https://github.com/kkarp9)  
[Manav Ray](https://github.com/manav-ray)  
[Brian Stephan](https://github.com/briantstephan)  

## How to run:
In the `/backend` directory, pip install the following python libraries:
* Django
* django-filter
* djangorestframework
* django-cors-headers
* pdfplumber

Then, run the command `python3 manage.py runserver`. This will spin up the backend.

To spin up the frontend for recruiters, navigate to the `/frontend/recruiters` directory. If this is your first time running the code, first run `npm i` to install the necessary packages. To spin up the recruiter frontend, type `npm start`.  
To spin up the frontend for students and admins, perform the same steps as listed above, except in the `/frontend/resumeapp` directory. 

## Example login credentials:  
### Admin
Username: admin@vt.edu  
Password: crudycube12  

### Student  
Username: bob_demo@vt.edu  
Password: crudycube12

### Recruiter
Username: recruiter@amazon.com  
Password: crudycube12
