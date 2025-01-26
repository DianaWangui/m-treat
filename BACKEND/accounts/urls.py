from django.urls import path
from .views import PatientRegistration, PatientLogin, UserProfileView

urlpatterns = [
    path('register/', PatientRegistration.as_view(), name='patient_registration_api'),
    path('login/', PatientLogin.as_view(), name='patient_login_api'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
