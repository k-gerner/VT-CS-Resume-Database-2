from rest_framework import status
from django.core import serializers
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from . import models
from . import serializers
import os
from django.conf import settings
import pdfplumber
from django.db.models import Q

@api_view(['GET'])
def apiOverview(request):
    api_urls = {
        "todo": "todo",
    }
    return Response(api_urls)


"""
Enpoint for admins to create a new recruiter.
"""
@api_view(['POST'])
def createRecruiter(request):
    if request.method == 'POST':
        if request.data["type"] == "Administrator":
            email = request.data.get('email', None)
            password = request.data.get('password', None)
            company_name = request.data.get('company', None)
            first_name = request.data.get('first', None)
            last_name = request.data.get('last', None)

            if User.objects.filter(username=email).exists():
                return Response(status=status.HTTP_400_BAD_REQUEST)

            else:
                user = User.objects.create_user(username=email, password=password)
                models.Recruiter.objects.create(user=user, company_name=company_name, first_name=first_name, last_name=last_name)
                return Response(status=status.HTTP_201_CREATED)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
            
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""
Endpoint for recruiters to login to the website.
"""
@api_view(['POST'])
def recruiterLogin(request):
    if request.method == 'POST':
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        if User.objects.filter(username=email).exists():
            user = User.objects.get(username=email)

            if user.check_password(password):
                if models.Recruiter.objects.filter(user=user).exists():
                    return Response(status=status.HTTP_200_OK)
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)

            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)


"""
Endpoint for CAS login. Will not be needed once proper CAS is integrated.
"""
@api_view(['POST'])
def casLogin(request):
    if request.method == 'POST':
        email = request.data.get('email', None)
        password = request.data.get('password', None)

        if User.objects.filter(username=email).exists():
            user = User.objects.get(username=email)

            if user.check_password(password):
                data = {}
                if models.Student.objects.filter(user=user).exists():
                    data = {"Type": "Student"}
                elif models.Administrator.objects.filter(user=user).exists():
                    data = {"Type": "Administrator"}
                else:
                    return Response(status=status.HTTP_401_UNAUTHORIZED)
                return Response(data, status=status.HTTP_200_OK)
            
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

"""
Endpoint for recruiters and admins to view all students.
"""
@api_view(['POST'])
def findAllStudents(request):
    if request.method == 'POST':
        if request.data["Type"] == "Recruiter" or request.data["Type"] == "Administrator":
            try:
                students = models.Student.objects.all().order_by('first_name')
            except models.Student.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            studentSerializer = serializers.StudentSerializer(students, many=True)
            return Response(studentSerializer.data, status=status.HTTP_200_OK)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
Endpoint for adminds to view all recruiters.
"""
@api_view(['POST'])
def getAllRecruiters(request):
    if request.method == 'POST':
        if request.data["Type"] == "Administrator":
            try:
                recruiters = models.Recruiter.objects.all()
            except models.Recruiter.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            recruiterSerializer = serializers.RecruiterSerializer(recruiters, many=True)
            return Response(recruiterSerializer.data, status=status.HTTP_200_OK)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
Endpoint for recruiters and admins to view a single student's profile.
"""
@api_view(['POST'])
def getSpecificStudent(request):
    if request.method == 'POST':
        if request.data["Type"] == "Recruiter" or request.data["Type"] == "Administrator":
            try:
                student = models.Student.objects.get(pid=request.data["StudentPID"])
            except models.Student.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            studentSerializer = serializers.StudentSerializer(student)
            return Response(studentSerializer.data, status=status.HTTP_200_OK)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Gets student profile provided pid.
"""
@api_view(['POST'])
def getStudentProfile(request):
    if request.method == 'POST':
        pid = request.data["pid"]
        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response({"error": "invalid_user_id"}, status=status.HTTP_404_NOT_FOUND)
        
        studentSerializer = serializers.StudentSerializer(student)
        return Response(studentSerializer.data, status=status.HTTP_200_OK)
  
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Adds a list of skill tags to a given student.
"""
@api_view(['POST'])
def addTagsToStudent(request):
    if request.method == 'POST':
        pid = request.data["pid"]
        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response({"error": "invalid_user_id"}, status=status.HTTP_404_NOT_FOUND)

        newTags = request.data["tags"]
        for tag in newTags:
            # print(tag)
            tagObj = models.SkillTag.objects.get(name=tag)
            # print(tagObj)
            student.skill_tags.add(tagObj)
        
        # student.skill_tags.add(models.SkillTag.objects.get())
        return Response({"success": "tags_added_successfully"}, status=status.HTTP_200_OK)
  
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Removes a single skill tag from a given student.
"""
@api_view(['POST'])
def deleteTagFromStudent(request):
    if request.method == 'POST':
        pid = request.data["pid"]

        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response({"error": "invalid_user_id"}, status=status.HTTP_404_NOT_FOUND)

        tagToRemove = request.data["tag"]
        tagObj = models.SkillTag.objects.get(name=tagToRemove)
        student.skill_tags.remove(tagObj)
        
        return Response({"success": "tags_added_successfully"}, status=status.HTTP_200_OK)
  
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Let's an admin delete a recruiter account.
"""
@api_view(['POST'])
def deleteRecruiter(request):
    if request.method == 'POST':
        if request.data["type"] == "Administrator":
            try:
                user = User.objects.get(username=request.data["recUsername"])
            except User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            user.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Endpoint to remove a list of students (only accessible by admins).
"""
@api_view(['POST'])
def deleteStudents(request):
    if request.method == 'POST':
        if request.data["type"] == "Administrator":
            student_pid_list = request.data["students"]
            dont_exist = []
            for stud in student_pid_list:
                if models.Student.objects.get(pid=stud):
                    student = models.Student.objects.get(pid=stud)
                    if student.resume:
                        os.remove(os.path.join(settings.MEDIA_ROOT, student.resume.name))
                    user = student.user
                    student.delete()
                    user.delete()
                else:
                    dont_exist.append(stud)

            return Response({"invalid_pids": dont_exist}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Searches for students given PID.
"""
@api_view(['POST'])
def studentPidSearch(request):
    if request.method == 'POST':
        if request.data["type"] == "Administrator":
            searchPID = request.data["searchPID"].lower()
            if not searchPID:
                try:
                    students = models.Student.objects.all().order_by('first_name')
                except models.Student.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            else:
                try:
                    students = models.Student.objects.filter(Q(pid__icontains=searchPID) | Q(class_standing__icontains=searchPID)).all()
                except models.Student.DoesNotExist:
                    return Response(status=status.HTTP_404_NOT_FOUND)
            studentSerializer = serializers.StudentSerializer(students, many=True)
            return Response(studentSerializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Searches for recruiters given company name.
"""
@api_view(['POST'])
def recruiterCompanySearch(request):
    if request.method == 'POST':
        if request.data["type"] == "Administrator":
            companyName = request.data["companyName"].lower()
            try:
                recruiters = models.Recruiter.objects.filter(company_name__icontains=companyName).all()
            except models.Recruiter.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            recruiterSerializer = serializers.RecruiterSerializer(recruiters, many=True)
            return Response(recruiterSerializer.data, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Let's an admin delete a skill tag
"""
@api_view(['POST'])
def adminDeleteTag(request):
    if request.method == 'POST':
        if request.data["type"] == "Administrator":
            try:
                tag = models.SkillTag.objects.get(name=request.data["deleteTag"])
            except models.SkillTag.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            tag.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Helper endpoint to make sure local storage user is still in db.
"""
@api_view(['POST'])
def recruiterExists(request):
    if request.method == 'POST':
        username = request.data["username"]
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            if models.Recruiter.objects.filter(user=user).exists():
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Helper endpoint to make sure local storage CAS user is still in db.
"""
@api_view(['POST'])
def casExists(request):
    if request.method == 'POST':
        username = request.data["username"]
        userType = request.data["type"]
        if userType == "Student":
            if models.Student.objects.filter(pid=username).exists():
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        elif userType == "Administrator":
            if models.Administrator.objects.filter(pid=username).exists():
                return Response(status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_403_FORBIDDEN)
        else:
            return Response(status=status.HTTP_403_FORBIDDEN)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Adds just one tag to a student.
"""
@api_view(['POST'])
def addTagToStudent(request):
    if request.method == 'POST':
        pid = request.data["pid"]

        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response({"error": "invalid_user_id"}, status=status.HTTP_404_NOT_FOUND)

        tagToAdd = request.data["tag"]
        tagObj = models.SkillTag.objects.get(name=tagToAdd)
        student.skill_tags.add(tagObj)

        return Response({"success": "tags_added_successfully"}, status=status.HTTP_200_OK)
  
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Returns all available skill tags if GET method, or
all skill tags a student can add if POST request.
"""
@api_view(['GET', 'POST'])
def getSkillTags(request):
    if request.method == 'GET':
        try:
            tags = models.SkillTag.objects.all()
        except models.SkillTag.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        skill_tags = {}
        for tag in tags:
            skill_tags[tag.name] = tag.name
        
        return Response(skill_tags, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        pid = request.data["pid"]
        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response({"error": "invalid_user_id"}, status=status.HTTP_404_NOT_FOUND)

        student_tags = student.skill_tags.all()
        
        try:
            tags = models.SkillTag.objects.all()
        except models.SkillTag.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        skill_tags = {}
        for tag in tags:
            if tag not in student_tags:
                skill_tags[tag.name] = tag.name

        return Response(skill_tags, status=status.HTTP_200_OK)

    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)

"""
Let's recruiters update their own password.
"""
@api_view(['POST'])
def updateRecruiterPassword(request):
    if request.method == 'POST':
        if request.data['Type'] == "Recruiter":
            oldPass = request.data['oldPassword']
            newPass = request.data['newPassword']
            username = request.data['Username']

            try:
                user = User.objects.get(username=username)
            except User.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            if user.check_password(newPass):
                return Response(status=status.HTTP_403_FORBIDDEN)

            if user.check_password(oldPass):
                user.set_password(newPass)
                user.save()
                return Response(status=status.HTTP_200_OK)

            return Response(status=status.HTTP_401_UNAUTHORIZED)


        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
Function to search for students provided parameters.
"""
@api_view(['POST'])
def search(request):
    if request.method == 'POST':

        if request.data['Type'] == "Recruiter":

            skills = request.data['skills']
            classes = request.data['classes']
            
            searching_skills = skills[0] != "null"
            searching_classes = classes[0] != "null"
            print("searching_skills: %s\nsearching_classes: %s" % (str(searching_skills), str(searching_classes)))

            if searching_skills and searching_classes:
                classes = [elem.upper() for elem in classes]
                queryset = models.Student.objects.filter(class_standing__in=classes)
                skills_searched = set(skills)
                num_matches_dict = {} # maps student id to # skill tag matches

                for stud in queryset.iterator():
                    stud_skills_arr = []
                    for tag in getattr(stud, 'skill_tags').iterator():
                        stud_skills_arr.append(tag.name)
                    
                    # if set(skills).issubset(set(stud_skills_arr)):
                    #     stud_matches.append(stud.id)
                    for skill in stud_skills_arr:
                        if skill in skills_searched:
                            if stud.pid in num_matches_dict:
                                num_matches_dict[stud.pid] += 1
                            else:
                                num_matches_dict[stud.pid] = 1

                num_matches_dict = {student_id:round(num_matches*100/len(skills)) for student_id, num_matches in num_matches_dict.items() if num_matches >= 0.5*len(skills)}
                
                # classes = [elem.upper() for elem in classes]
                # students = models.Student.objects.filter(class_standing__in=classes, id__in=stud_matches).order_by('first_name')
                students = queryset.filter(pid__in=num_matches_dict.keys())
                students = sorted(students, key=lambda s:num_matches_dict[s.pid], reverse=True)
                studentSerializer = serializers.StudentSerializer(students, many=True)
                combined_data = {'student_data':studentSerializer.data, 'pid_num_matches':num_matches_dict}
                # return Response(studentSerializer.data, status=status.HTTP_200_OK)
                return Response(combined_data, status=status.HTTP_200_OK)


            elif searching_skills and not searching_classes:
                queryset = models.Student.objects.all()
                skills_searched = set(skills)
                num_matches_dict = {} # maps student id to # skill tag matches

                for stud in queryset.iterator():
                    stud_skills_arr = []
                    for tag in getattr(stud, 'skill_tags').iterator():
                        stud_skills_arr.append(tag.name)
                    
                    # if set(skills).issubset(set(stud_skills_arr)):
                    #     stud_matches.append(stud.id)
                    for skill in stud_skills_arr:
                        if skill in skills_searched:
                            if stud.pid in num_matches_dict:
                                num_matches_dict[stud.pid] += 1
                            else:
                                num_matches_dict[stud.pid] = 1

                num_matches_dict = {student_id:round(num_matches*100/len(skills)) for student_id, num_matches in num_matches_dict.items() if num_matches >= 0.5*len(skills)}

                students = models.Student.objects.filter(pid__in=num_matches_dict.keys())
                students = sorted(students, key=lambda s:num_matches_dict[s.pid], reverse=True)
                studentSerializer = serializers.StudentSerializer(students, many=True)
                combined_data = {'student_data':studentSerializer.data, 'pid_num_matches':num_matches_dict}
                # return Response(studentSerializer.data, status=status.HTTP_200_OK)
                return Response(combined_data, status=status.HTTP_200_OK)
            
            elif searching_classes and not searching_skills:
                classes = [elem.upper() for elem in classes]
                students = models.Student.objects.filter(class_standing__in=classes).order_by('first_name')
                studentSerializer = serializers.StudentSerializer(students, many=True)
                # return Response(studentSerializer.data, status=status.HTTP_200_OK)
                return Response({'student_data':studentSerializer.data, 'pid_num_matches':{}}, status=status.HTTP_200_OK)
            
            else:
                students = models.Student.objects.all()
                studentSerializer = serializers.StudentSerializer(students, many=True)
                return Response({'student_data':studentSerializer.data, 'pid_num_matches':{}}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)


"""
Endpoint to upload file to path. Returns a json that contains the suggested skill tags (excluding ones already in use by student)
"""
@api_view(['POST'])
def uploadResume(request):
    if request.method == 'POST':
        pid = request.data['pid']
        resume = request.data['resume_file']

        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if student.resume:
            os.remove(os.path.join(settings.MEDIA_ROOT, student.resume.name))
        
        student.resume = resume
        student.save() 

        curr_student_tags = []
        for tag in student.skill_tags.all():
            curr_student_tags.append(tag.name)

        all_tags = generateSuggestedTags(os.path.join(settings.MEDIA_ROOT, student.resume.name))

        suggested_tags = list(set(all_tags) - set(curr_student_tags))
        
        return Response({"suggested_tags" : suggested_tags}, status=status.HTTP_200_OK)
    else:
        return Response(status=status.HTTP_400_BAD_REQUEST)


"""
Helper method to generate suggested skill tags
Parameters:
    file_path: path to the PDF file to analyze
Returns:
    list of strings (SkillTag names)
"""
def generateSuggestedTags(file_path):
    with pdfplumber.open(file_path) as pdf:
        file_string_contents = ""
        for page in pdf.pages:
            try:
                file_string_contents += page.extract_text()
            except TypeError:
                continue
    file_string_contents = file_string_contents.lower()
    punctuation = "[]\{\}()\\/\"'!@#$%^&*()-_+=.,?;:|~`"
    for punc in punctuation:
        file_string_contents = file_string_contents.replace(punc, " ")
    file_contents_set = set(file_string_contents.split())
    available_skill_tag_objects = models.SkillTag.objects.all()
    suggested_tags = [] # list of strings
    for tag in available_skill_tag_objects:
        if tag.name.lower() in file_contents_set:
            suggested_tags.append(tag.name)
    return suggested_tags


"""
Helper function to return combined list of skill tags given list of strings and list of skill tags
Parameters:
    names_list: list of strings that represent the names of skill tags
    tags_list:  list of skill tag objects
Returns:
    (on success) tuple containing True, and new combined list of SkillTag objects
    (on failure) tuple containing False, and tag name that caused the error
"""
def getCombinedSkillTagsList(names_list, tags_list):
    tags_list_names = set([tag.name for tag in tags_list])
    for tag_name in names_list:
        if tag_name not in tags_list_names:
            try:
                new_tag = models.SkillTag.objects.get(name=tag_name)
                tags_list.append(new_tag)
            except models.SkillTag.DoesNotExist:
                return False, tag_name
    return True, tags_list


"""
Let's admin add a list of skill tags to db.
"""
@api_view(['POST'])
def adminSkillTagAdd(request):
    if request.method == 'POST':
        skill_tags = request.data["tags"]
        userType = request.data["type"]
        if userType == "Administrator":
            already_exist = []
            for tag in skill_tags:
                if models.SkillTag.objects.filter(name=tag).exists():
                    already_exist.append(tag)
                else:
                    models.SkillTag.objects.create(name=tag)

            return Response({"already_exist": already_exist}, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED) 
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""
Updates a given student's class standing.
"""
@api_view(['POST'])
def updateStudentClass(request):
    if request.method == 'POST':
        pid = request.data["pid"]
        new_class = request.data["class"].upper()
        try:
            student = models.Student.objects.get(pid=pid)
        except models.Student.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        
        # print('{} {}'.format(pid, new_class))
        student.class_standing = new_class
        student.save()
        return Response(status=status.HTTP_200_OK)

    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)