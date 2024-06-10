from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny

class CheckAdminStatusAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = request.user
        is_admin = user.is_staff
        is_authenticated = request.user.is_authenticated
        return Response({'is_authenticated': is_authenticated,'is_admin': is_admin}, status=status.HTTP_200_OK)
