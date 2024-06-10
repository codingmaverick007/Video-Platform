from urllib.parse import urlencode
from django.http import JsonResponse
from django.urls import reverse
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import Post, Comment
from .serializers import CommentSerializer, PostDetailSerializer, PostListSerializer


class PostUploadAPIView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = PostDetailSerializer
    permission_classes = (permissions.IsAdminUser,)
    
    @swagger_auto_schema(request_body=PostDetailSerializer)
    def post(self, request,):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
    

class PostListAPIView(APIView):
    parser_classes = (MultiPartParser,)
    serializer_class = PostListSerializer
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('search', openapi.IN_QUERY, description='Search keyword', type=openapi.TYPE_STRING),
            openapi.Parameter('page', openapi.IN_QUERY, description='Page number', type=openapi.TYPE_INTEGER),
            # openapi.Parameter('page_size', openapi.IN_QUERY, description='Page size', type=openapi.TYPE_INTEGER),
        ],
        responses={200: PostListSerializer(many=True)})
    def get(self, request):
        post = Post.objects.all()
        serializer_context = {
            'request':request
        }
        serializer = self.serializer_class(post, context= serializer_context, many=True)
        return Response(serializer.data)
    

class PostDetailAPIView(APIView):
    parser_classes = (MultiPartParser,)
    serializer_class = PostDetailSerializer
    permission_classes = (permissions.IsAuthenticated,)
    # pagination_class = PageNumberPagination

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('pk', openapi.IN_PATH, description='Post ID', type=openapi.TYPE_INTEGER)
        ],
        responses={200: PostDetailSerializer}
    )
    def get(self, request, pk, *args, **kwargs):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        previous_post = Post.objects.filter(pk__lt=pk).order_by('-pk').first()
        next_post = Post.objects.filter(pk__gt=pk).order_by('pk').first()

        serializer = self.serializer_class(post, context={'request': request})

        if previous_post:
            serializer.data['previous_post'] = self.serializer_class(previous_post, context={'request': request}).data # if previous_post else None
        
        if next_post:
            serializer.data['next_post'] = self.serializer_class(next_post, context={'request': request}).data # if next_post else None

        return Response(serializer.data, status=status.HTTP_200_OK)
    

class PostCommentsAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    @swagger_auto_schema(
        responses={200: CommentSerializer(many=True), 404: "No comments found for this post"}
    )
    def get(self, request, pk):
        comments = Comment.objects.filter(post_id=pk)
        if not comments.exists():
            return Response({"message": "No comments found for this post"}, status=status.HTTP_404_NOT_FOUND)

        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
        

class AddCommentAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = CommentSerializer
    
    @swagger_auto_schema(
        request_body=CommentSerializer,
        responses={201: CommentSerializer, 400: "Bad Request"}
    )
    def post(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.serializer_class(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(post=post, author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 

class PostDeleteAPIView(APIView):
    permission_classes = [permissions.IsAdminUser,]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('pk', openapi.IN_PATH, description='Post ID', type=openapi.TYPE_INTEGER)
        ],
        responses={
            204: openapi.Response(description='No Content'),
            404: openapi.Response(description='Not Found')
        }
    )
    def delete(self, request, pk, *args, **kwargs):
        try:
            post = Post.objects.get(pk=pk)
            post.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)