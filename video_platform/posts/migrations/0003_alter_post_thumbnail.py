# Generated by Django 5.0.4 on 2024-06-09 21:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('posts', '0002_post_thumbnail'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='thumbnail',
            field=models.ImageField(blank=True, max_length=500, null=True, upload_to='thumbnails/'),
        ),
    ]
