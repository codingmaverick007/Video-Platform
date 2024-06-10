from django.urls import reverse
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase, APIRequestFactory, force_authenticate, APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

from .views import PostDetailAPIView, PostListAPIView, PostUploadAPIView
from .models import Post

User = get_user_model()

"""
TEST LISTING ALL POSTS
"""
class PostListAPITestCase(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PostListAPIView.as_view()
        self.url = reverse('post-list')

        # Creating testing data
        self.post1 = Post.objects.create(title='Post 1', description='Description 2')
        self.post2 = Post.objects.create(title='Post 2', description='Description 2')
        
        self.user = User.objects.create_user(email='ben@gmail.com',username='ben', password='benbenben')
        self.token = Token.objects.create(user=self.user)
    # def tearDown(self):
    #     self.client.force_authenticate(user=None)

    def test_list_post(self):
        request = self.factory.get(self.url)
        
        force_authenticate(request, user=self.user, token=self.token)

        response = self.view(request)
        print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

"""
TEST GET DETAILED POSTS
"""
class PostDetailAPITestCase(APITestCase):
    
    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PostDetailAPIView.as_view()

        # Test data
        self.post = Post.objects.create(title='Post', description='Description')

        self.user = User.objects.create_user(email='ben@gmail.com',username='ben', password='benbenben')
        self.token = Token.objects.create(user=self.user)

    # def tearDown(self):
    #     self.client.force_authenticate(user=None)
    
    # Test GET request to fetch post detail by ID.
    def test_get_detailed_post(self):
        url = reverse('post-detail', kwargs={'pk': self.post.pk})
        request = self.factory.get(url)
        force_authenticate(request, user=self.user, token=self.token)

        response = self.view(request, pk=self.post.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Post')
        self.assertEqual(response.data['description'], 'Description')

    # Test GET request for a nonexistent post.
    def test_get_nonexistent_post(self):        
        url = reverse('post-detail', kwargs={'pk': 999})  # nonexistent ID
        request = self.factory.get(url)
        force_authenticate(request, user=self.user, token=self.token)

        response = self.view(request, pk=999)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'Post not found')
    
    # Test that previous and next posts are included in the response
    def test_previous_and_next_posts(self):
        # more test data to check for next and previous urls
        post2 = Post.objects.create(title='Second Post', description='Description 2')
        post3 = Post.objects.create(title='Third Post', description='Description 3')

        url = reverse('post-detail', kwargs={'pk': post2.pk})
        request = self.factory.get(url)
        force_authenticate(request, user=self.user, token=self.token)

        response = self.view(request, pk=post2.pk)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # print(response.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Check for previous post URL and title
        self.assertEqual(response.data['previous_post_url'], 'http://testserver/api/v1/post-detail/1/')

        # Check for next post URL and title
        self.assertEqual(response.data['next_post_url'], 'http://testserver/api/v1/post-detail/3/')


"""
TEST FILE UPLOADS AND FILE TYPE
"""

class PostUploadAPIViewTestCase(APITestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.view = PostUploadAPIView.as_view()
        self.url = reverse('post-upload')

    # def tearDown(self):
    #     self.client.force_authenticate(user=None)

        self.admin_user = User.objects.create_user(email='mike@gmail.com',username='mike', password='mikemikemike', is_staff=True, is_superuser=True)
        self.admin_token = Token.objects.create(user=self.admin_user)

        self.regular_user = User.objects.create_user(email='ben@gmail.com',username='ben', password='benbenben', is_staff=True, is_superuser=True)
        self.regular_token = Token.objects.create(user=self.regular_user)

        video_file_path = 'media/SampleVideo_1280x720_2mb.mp4'
        video_file = open(video_file_path, 'rb')

        self.request_data = {
            'title': 'Video Post',
            'description': 'Video description',
            'video': SimpleUploadedFile(video_file.name, video_file.read(), content_type='video/mp4',)
        }


    def test_admin_upload_video(self):
        request = self.factory.post(self.url, self.request_data, format='multipart')
        force_authenticate(request, user=self.admin_user, token=self.admin_token)

        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['title'], 'Video Post')
        self.assertEqual(response.data['description'], 'Video description')

        # Check if the video file is uploaded and saved correctly
        post = Post.objects.get(id=response.data['id'])
        self.assertIsNotNone(post.video)

    def test_regular_user_upload_post(self):
        request = self.factory.post(self.url, self.request_data, format='multipart')
        force_authenticate(request, user=self.regular_user)
        response = self.client.post(self.url, self.request_data, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Post.objects.count(), 0)

    def test_invalid_video_format(self):
        # Test POST request with invalid video format to PostUploadAPIView.
        invalid_video_content = b'This is not a video file.'
        invalid_video_file = SimpleUploadedFile('invalid_video.txt', invalid_video_content, content_type='text/plain')

        request_data = {
            'title': 'Invalid Video Post',
            'description': 'Invalid video description',
            'video': invalid_video_file,
        }

        request = self.factory.post(self.url, request_data, format='multipart')
        force_authenticate(request, user=self.admin_user, token=self.admin_token)

        response = self.view(request)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('video', response.data)  # Check for errors related to video field

