# Serializers are used to format querysets properly to be sent in the response.
# "https://www.django-rest-framework.org/api-guide/serializers/"

from rest_framework import serializers
from . import models
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username']

class SkillTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SkillTag
        fields = ['name']

class StudentSerializer(serializers.ModelSerializer):
    skill_tags = SkillTagSerializer(many=True)

    class Meta:
        model = models.Student
        fields = ['first_name', 'last_name', 'email', 'pid', 'class_standing', 'skill_tags', 'resume']

class RecruiterSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = models.Recruiter
        fields = ['user', 'company_name']