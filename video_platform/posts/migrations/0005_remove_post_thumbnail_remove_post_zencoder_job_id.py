# Generated by Django 5.0.4 on 2024-06-10 08:22

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0004_post_zencoder_job_id'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='thumbnail',
        ),
        migrations.RemoveField(
            model_name='post',
            name='zencoder_job_id',
        ),
    ]
