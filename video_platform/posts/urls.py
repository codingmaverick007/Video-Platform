from django.urls import path

from .views import PostDetailAPIView, PostListAPIView, PostCommentsAPIView, PostUploadAPIView, AddCommentAPIView, PostDeleteAPIView

urlpatterns = [
    path('', PostListAPIView.as_view(), name= 'post-list'),
    path('post-detail/<int:pk>/', PostDetailAPIView.as_view(), name='post-detail'),
    path('view-comments/<int:pk>/', PostCommentsAPIView.as_view(), name='view-comments'),
    path('add-comment/<int:pk>/', AddCommentAPIView.as_view(), name='add-comments'),
    path('post-upload/', PostUploadAPIView.as_view(), name='post-upload'),
    path('post-delete/<int:pk>/', PostDeleteAPIView.as_view(), name='post-delete'),
]
