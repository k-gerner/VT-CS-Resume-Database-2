# Generated by Django 3.2.9 on 2021-12-01 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RestAPI', '0008_auto_20211122_0540'),
    ]

    operations = [
        migrations.AddField(
            model_name='student',
            name='job_description',
            field=models.CharField(choices=[('INTERNSHIP', 'Internship'), ('FULL-TIME', 'Full-time'), ('INTERNSHIP OR FULL-TIME', 'Internship OR Full-time'), ('NOT LOOKING FOR WORK', 'Not looking for work')], default='INTERNSHIP OR FULL-TIME', max_length=50),
        ),
    ]
