from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework import generics, status
from .serializers import PatientRegistarationSerializer, MyTokenObtainPairSerializer, PatientUpdateSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

# Serve React's index.html file from the static folder
class IndexView(TemplateView):
    template_name = 'index.html'

class PatientRegistration(generics.CreateAPIView):
  serializer_class = PatientRegistarationSerializer
  permission_classes = [AllowAny]
  

class PatientLogin(TokenObtainPairView):
  serializer_class = MyTokenObtainPairSerializer
  permission_classes = [AllowAny]


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get(self, request):
        user = request.user
        serializer = PatientRegistarationSerializer(user)

        return Response(serializer.data)

class UpdateUserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def put(self, request):
        user = request.user
        serializer = PatientUpdateSerializer(user, data=request.data)

        if serializer.is_valid():
            updated_user = serializer.save()

            return Response(PatientUpdateSerializer(updated_user).data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)