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
    # Need to check if request is made by an admin
    # (can put some kind of credentials in request).
    if request.method == 'POST':
        email = request.data.get('email', None)
        password = request.data.get('password', None)
        company_name = request.data.get('company', None)

        if User.objects.filter(username=email).exists():
            return Response(status=status.HTTP_400_BAD_REQUEST)

        else:
            user = User.objects.create_user(username=email, password=password)
            models.Recruiter.objects.create(user=user, company_name=company_name)
            return Response(status=status.HTTP_201_CREATED)

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
Endpoint for recruiters to view all students.
"""
@api_view(['GET', 'POST'])
def findAllStudents(request):
    if request.method == 'POST':
        if request.data["Type"] == "Recruiter":
            try:
                students = models.Student.objects.all().order_by('first_name')
            except models.Student.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            studentSerializer = serializers.StudentSerializer(students, many=True)
            return Response(studentSerializer.data)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

    return Response(status=status.HTTP_401_UNAUTHORIZED)

"""
Endpoint for recruiters to view a single student's profile.
"""
@api_view(['POST'])
def getSpecificStudent(request):
    if request.method == 'POST':
        if request.data["Type"] == "Recruiter":
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
            
            skillsIsNone = skills[0] == "null"
            classesIsNone = classes[0] == "null"

            if not skillsIsNone and not classesIsNone:
                queryset = models.Student.objects.all()
                stud_matches = []

                for stud in queryset.iterator():
                    stud_skills_arr = []
                    for tag in getattr(stud, 'skill_tags').iterator():
                        stud_skills_arr.append(tag.name)
                    
                    if set(skills).issubset(set(stud_skills_arr)):
                        stud_matches.append(stud.id)
                
                classes = [elem.upper() for elem in classes]
                students = models.Student.objects.filter(class_standing__in=classes, id__in=stud_matches).order_by('first_name')
                studentSerializer = serializers.StudentSerializer(students, many=True)
                return Response(studentSerializer.data, status=status.HTTP_200_OK)


            elif not skillsIsNone:
                queryset = models.Student.objects.all()
                stud_matches = []

                for stud in queryset.iterator():
                    stud_skills_arr = []
                    for tag in getattr(stud, 'skill_tags').iterator():
                        stud_skills_arr.append(tag.name)
                    
                    if set(skills).issubset(set(stud_skills_arr)):
                        stud_matches.append(stud.id)

                students = models.Student.objects.filter(id__in=stud_matches).order_by('first_name')
                studentSerializer = serializers.StudentSerializer(students, many=True)
                return Response(studentSerializer.data, status=status.HTTP_200_OK)
            
            elif not classesIsNone:
                classes = [elem.upper() for elem in classes]
                students = models.Student.objects.filter(class_standing__in=classes).order_by('first_name')
                studentSerializer = serializers.StudentSerializer(students, many=True)
                return Response(studentSerializer.data, status=status.HTTP_200_OK)
            
            else:
                students = models.Student.objects.all()
                studentSerializer = serializers.StudentSerializer(students, many=True)
                return Response(studentSerializer.data)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)






'''
Endpoint to upload file to path. Returns a json that contains the suggested skill tags (excluding ones already in use by student)
'''
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


# """
# Endpoint to add skill tags to student
# """
# @api_view(['POST'])
# def addStudentSkillTags(request):
#     if request.method == 'POST':
#         # TODO: Have some sort of authentication here to make sure the request is valid (e.g. make sure someone didn't just edit the request to change someone else's skill tags)
#         pid = request.data.get('StudentPID', None)
#         try:
#             student = models.Student.objects.get(pid=pid) # do we get students this way?
#         except models.Student.DoesNotExist:
#             error_json = {
#                 "invalid_user_id":pid
#             }
#             return Response(error_json, status=status.HTTP_404_NOT_FOUND)

#         new_tag_names = request.data.get('tags', []) # list of strings
#         student_tag_list = getattr(student, skill_tags) # list of SkillTag objects
#         success, updated_tag_list = getCombinedSkillTagsList(new_tag_names, student_tag_list)
#         if success:
#             student.update(skill_tags = updated_tag_list)
#             return_json = {
#                 "updated_tag_names" : [tag.name for tag in updated_tag_list]
#             }
#             return Response(return_json, status=status.HTTP_200_OK)
#         else:
#             error_json = {
#                 "invalid_tag":updated_tag_list # note this is actually a single string in this case
#             }
#             return Response(error_json, status=status.HTTP_404_NOT_FOUND)