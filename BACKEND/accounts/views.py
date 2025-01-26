from rest_framework import generics
from .serializers import PatientRegistarationSerializer, MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response

class PatientRegistration(generics.CreateAPIView):
  serializer_class = PatientRegistarationSerializer
  permission_classes = [AllowAny]

class PatientLogin(TokenObtainPairView):
  serializer_class = MyTokenObtainPairSerializer
  permission_classes = [AllowAny]

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        serializer = PatientRegistarationSerializer(user)

        return Response(serializer.data)
