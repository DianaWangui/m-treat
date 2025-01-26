from rest_framework import serializers
from .models import Patient
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class PatientRegistarationSerializer(serializers.ModelSerializer):
  class Meta:
    model = Patient
    fields = ['username', 'email', 'phone', 'address', 'password']

  password = serializers.CharField(write_only=True)

  def create(seld, validated_data):
    patient = Patient(**validated_data)
    patient.set_password(validated_data['password'])
    patient.save()
    return patient

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
  def validate(self, attrs):
    data = super().validate(attrs)
    user_data = PatientRegistarationSerializer(self.user).data
    data['user'] = user_data
    return data 
    