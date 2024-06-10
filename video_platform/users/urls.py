from django.urls import path
from .views import CheckAdminStatusAPIView

urlpatterns = [
    path('check-admin-status/', CheckAdminStatusAPIView.as_view(), name='check-admin-status'),
]
