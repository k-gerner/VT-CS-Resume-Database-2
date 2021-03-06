# Generated by Django 3.2.8 on 2021-10-16 02:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('RestAPI', '0003_alter_student_skill_tags'),
    ]

    operations = [
        migrations.RenameField(
            model_name='student',
            old_name='first_name',
            new_name='pid',
        ),
        migrations.RemoveField(
            model_name='student',
            name='email',
        ),
        migrations.RemoveField(
            model_name='student',
            name='last_name',
        ),
        migrations.AddField(
            model_name='administrator',
            name='pid',
            field=models.CharField(default='Placeholder', max_length=255),
        ),
        migrations.AddField(
            model_name='student',
            name='resume',
            field=models.FileField(blank=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='student',
            name='class_standing',
            field=models.CharField(choices=[('FRESHMAN', 'Freshman'), ('SOPHOMORE', 'Sophomore'), ('JUNIOR', 'Junior'), ('SENIOR', 'Senior'), ('MASTERS', "Master's"), ('PHD', 'PhD')], default='FRESHMAN', max_length=50),
        ),
    ]
