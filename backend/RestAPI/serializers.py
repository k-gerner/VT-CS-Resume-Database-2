# Serializers are used to format querysets properly to be sent in the response.
# "https://www.django-rest-framework.org/api-guide/serializers/"

from rest_framework import serializers
from . import models

class SkillTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SkillTag
        fields = ['name']

class StudentSerializer(serializers.ModelSerializer):
    skill_tags = SkillTagSerializer(many=True)

    class Meta:
        model = models.Student
        fields = ['first_name', 'last_name', 'email', 'pid', 'class_standing', 'skill_tags', 'resume']