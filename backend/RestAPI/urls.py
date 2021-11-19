from django.urls import path
from . import views

urlpatterns = [
    path('', views.apiOverview, name="api-overview"),
    path('create-recruiter/', views.createRecruiter, name="create-recruiter"),
    path('recruiter-login/', views.recruiterLogin, name="recruiter-login"),
    path('cas-login/', views.casLogin, name="cas-login"),
    path('all-students/', views.findAllStudents, name="all-students"),
    path('student/', views.getSpecificStudent, name="specific-student"),
    path('skill_tags/', views.getSkillTags, name="skill-tags"),
    path('search/', views.search, name="search"),
    path('update-password/', views.updateRecruiterPassword, name="update-password"),
    path('student-profile-data/', views.getStudentProfile, name="student-profile"),
    path('add-tags-student/', views.addTagToStudent, name="add-tags-student"),
    path('remove-tag-student/', views.deleteTagFromStudent, name="remove-tag-student"),
    path('upload-resume/', views.uploadResume, name='upload-resume'),
    path('add-single-tag-student/', views.addTagToStudent, name="add-single-tag-student"),
]