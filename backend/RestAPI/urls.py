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
    path('add-tags-student/', views.addTagsToStudent, name="add-tags-student"),
    path('remove-tag-student/', views.deleteTagFromStudent, name="remove-tag-student"),
    path('upload-resume/', views.uploadResume, name='upload-resume'),
    path('delete-resume/', views.deleteResume, name='delete-resume'),
    path('add-single-tag-student/', views.addTagToStudent, name="add-single-tag-student"),
    path('get-all-recruiters/', views.getAllRecruiters, name="get-all-recruiters"),
    path('delete-recruiter/', views.deleteRecruiter, name="delete-recruiter"),
    path('recruiter-exists/', views.recruiterExists, name="recruiter-exists"),
    path('cas-exists/', views.casExists, name="cas-exists"),
    path('update-student-class/', views.updateStudentClass, name="update-student-class"),
    path('update-student-job-description/', views.updateStudentJobDescription, name="update-student-job-description"),
    path('admin-add-tags/', views.adminSkillTagAdd, name="admin-add-tags"),
    path('admin-delete-tag/', views.adminDeleteTag, name="admin-delete-tag"),
    path('delete-students/', views.deleteStudents, name="delete-students"),
    path('pid-search/', views.studentPidSearch, name="pid-search"),
    path('company-search/', views.recruiterCompanySearch, name="company-search"),
    path('skill-tag-search/', views.skillTagSearch, name="skill-tag-search"),
]