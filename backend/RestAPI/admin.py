from django.contrib import admin
from . import models

admin.site.register(models.SkillTag)
admin.site.register(models.Student)
admin.site.register(models.Recruiter)
admin.site.register(models.Administrator)