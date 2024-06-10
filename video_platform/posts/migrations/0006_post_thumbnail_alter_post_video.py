# Generated by Django 5.0.4 on 2024-06-10 09:03

import django.core.validators
import posts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0005_remove_post_thumbnail_remove_post_zencoder_job_id'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='thumbnails/'),
        ),
        migrations.AlterField(
            model_name='post',
            name='video',
            field=models.FileField(upload_to='videos/', validators=[django.core.validators.FileExtensionValidator(allowed_extensions=['mp4', 'mkv']), posts.models.validate_mime_type]),
        ),
    ]
