from django.db import models
from django.urls import reverse
from django.core.validators import ValidationError, FileExtensionValidator
from django.contrib.auth import get_user_model
import magic, os
import tempfile
from moviepy.editor import VideoFileClip
from django.core.files.base import ContentFile
import logging

# Create your models here.
def validate_mime_type(file):
    supported_types=['video/mp4', 'video/x-flv', 'video/quicktime', 'video/x-msvideo', 'video/x-ms-wmv', 'video/x-matroska']
    file_mime_type = magic.from_buffer(file.read(1024), mime=True)
    print(file_mime_type)
    if file_mime_type not in supported_types:
        raise ValidationError('unsupported file type')


logger = logging.getLogger(__name__)

class Post(models.Model):
    title = models.CharField(max_length=255)
    video = models.FileField(upload_to='', validators=[FileExtensionValidator(allowed_extensions=['mp4', 'mkv'])])
    thumbnail = models.ImageField(upload_to='thumbnails/', null=True, blank=True)
    description = models.TextField()
    uploaded_at = models.DateField(auto_now_add=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        if self.video and not self.thumbnail:
            self.generate_thumbnail()

    def generate_thumbnail(self):
        try:
            # Use in-memory file to avoid using .path
            video_file = self.video.open()
            with tempfile.NamedTemporaryFile(delete=False) as temp_video:
                temp_video.write(video_file.read())
                temp_video.flush()
                video_file.close()

                logger.debug(f"Temp Video Path: {temp_video.name}")

                with VideoFileClip(temp_video.name) as video:
                    frame = video.get_frame(1)  # Get a frame at 1 second
                  
                    from PIL import Image
                    image = Image.fromarray(frame)
                    thumb_io = tempfile.NamedTemporaryFile(suffix='.jpg')
                    image.save(thumb_io, format='JPEG')
                    thumb_io.seek(0)

                    
                    self.thumbnail.save(
                        f'{self.id}_thumbnail.jpg',
                        ContentFile(thumb_io.read()),
                        save=False
                    )
                    thumb_io.close()

                temp_video.close()
        except Exception as e:
            # Log the error and continue without a thumbnail
            logger.error(f"Error generating thumbnail: {e}")

        # Save the instance again to ensure the thumbnail is saved
        super().save()

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("post-detail", kwargs={"pk": self.pk})
        
    
    
class Comment(models.Model): 
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.CharField(max_length=255)
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE,)
    posted_at = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.comment
    
    def get_absolute_url(self):
        return reverse('posts')