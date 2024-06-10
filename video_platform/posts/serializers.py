from urllib.parse import quote
from django.urls import reverse
from rest_framework import serializers

from .models import Post, Comment


class PostListSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='post-detail', lookup_field='pk')

    class Meta:
        model = Post
        fields = ['id', 'url', 'title', 'video', 'thumbnail']

    def get_thumbnail(self, obj):
        return obj.thumbnail

class PostDetailSerializer(serializers.HyperlinkedModelSerializer):
    previous_post_url = serializers.SerializerMethodField()
    next_post_url = serializers.SerializerMethodField()
    share_facebook = serializers.SerializerMethodField()
    share_twitter = serializers.SerializerMethodField()
    share_linkedin = serializers.SerializerMethodField()
    share_whatsapp = serializers.SerializerMethodField()
    share_email = serializers.SerializerMethodField()
    copy_link = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('url', 'id', 'title', 'video', 'description', 'previous_post_url', 'next_post_url', 'share_facebook', 'share_twitter', 'share_linkedin', 'share_whatsapp', 'share_email', 'copy_link', 'uploaded_at',)
        extra_kwargs = {
            'url': {'view_name': 'post-detail', 'lookup_field': 'pk'}
        }

    def get_previous_post_url(self, obj):
        request=self.context.get('request')
        previous_post = Post.objects.filter(pk__lt=obj.pk).order_by('-pk').first()
        if previous_post:
            return request.build_absolute_uri(reverse('post-detail', kwargs={'pk': previous_post.pk}))
        return None
    
    def get_next_post_url(self, obj):
        request=self.context.get('request')
        next_post = Post.objects.filter(pk__gt=obj.pk).order_by('pk').first()
        if next_post:
            return request.build_absolute_uri(reverse('post-detail', kwargs={'pk': next_post.pk}))
        return None
    
    def get_share_facebook(self, obj):
        request = self.context.get('request')
        return f'https://www.facebook.com/sharer/sharer.php?u={quote(request.build_absolute_uri(obj.get_absolute_url()))}'

    def get_share_twitter(self, obj):
        request = self.context.get('request')
        return f'https://twitter.com/intent/tweet?url={quote(request.build_absolute_uri(obj.get_absolute_url()))}'
    
    def get_share_linkedin(self, obj):
        request = self.context.get('request')
        return f'https://www.linkedin.com/shareArticle?url={quote(request.build_absolute_uri(obj.get_absolute_url()))}'
    
    def get_share_pintrest(self, obj):
        request = self.context.get('request')
        return f'https://pinterest.com/pin/create/button/?url={quote(request.build_absolute_uri(obj.get_absolute_url()))}'
    
    def get_share_whatsapp(self, obj):
        request = self.context.get('request')
        return f'https://api.whatsapp.com/send?text={quote(request.build_absolute_uri(obj.get_absolute_url()))}'
    
    def get_share_email(self, obj):
        request = self.context.get('request')
        return f"mailto:?subject={quote(obj.title)}&body={quote(quote(request.build_absolute_uri(obj.get_absolute_url())))}"
    
    def get_copy_link(self, obj):
        return self.context['request'].build_absolute_uri(obj.get_absolute_url())
    

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['post', 'comment', 'username', 'posted_at']
        read_only_fields = ['post', 'username', 'posted_at']


    # def create(self, validated_data):
    #     # Assuming the post and user are set explicitly in the view
    #     post = validated_data.pop('post')
    #     author = validated_data.pop('author')
    #     return Comment.objects.create(post=post, author=author, **validated_data)