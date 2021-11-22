from django.db import models
from django.contrib.auth.models import User


"""
Model / DB Table to store individual skill tags.
"""
class SkillTag(models.Model):
    name = models.CharField(max_length=250)

    def __str__(self):
        return self.name


"""
None of the VT user models extend Django users since authentication is taken
care by VT CAS. Need to discuess authentication for recruiters.
"""

# Specify file path to where resume must be uploaded.
def resume_upload_path(instance, filename):
    return '/'.join(['pdfresumes', filename])

class Student(models.Model):
    class Classes(models.TextChoices):
        FRESHMAN = "FRESHMAN", "Freshman"
        SOPHOMORE = "SOPHOMORE", "Sophomore"
        JUNIOR = "JUNIOR", "Junior"    
        SENIOR = "SENIOR", "Senior"
        MASTERS = "MASTERS", "Master's"
        PHD = "PHD", "PhD"


    # id field is automatically incremented.
    user = models.OneToOneField(User, on_delete=models.CASCADE) # Replacement for CAS. Delete when CAS is integrated.
    first_name = models.CharField(max_length=255, default="John")
    last_name = models.CharField(max_length=255, default="Doe")
    email = models.EmailField(max_length=255, unique=True, default="jdoe@vt.edu")
    pid = models.CharField(max_length=255) # field comes directly from CAS.
    class_standing = models.CharField(max_length=50, choices = Classes.choices, default=Classes.FRESHMAN)
    skill_tags = models.ManyToManyField(SkillTag, blank=True)
    resume = models.FileField(blank=True, upload_to=resume_upload_path)

    def __str__(self):
        return self.pid



class Recruiter(models.Model):
    # id field is automatically incremented.
    user = models.OneToOneField(User, on_delete=models.CASCADE) # Using django inbuilt user since not using CAS.
    first_name = models.CharField(max_length=255, default="John")
    last_name = models.CharField(max_length=255, default="Doe")
    company_name = models.CharField(max_length=255)

    def __str__(self):
        return self.user.username

class Administrator(models.Model):
    # id field is automatically incremented.
    user = models.OneToOneField(User, on_delete=models.CASCADE) # Replacement for CAS. Delete when CAS is integrated.
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, unique=True)
    pid = models.CharField(max_length=255) # field comes directly from CAS.

    def __str__(self):
        return self.pid