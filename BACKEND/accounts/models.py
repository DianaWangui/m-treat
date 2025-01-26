from django.db import models
from django.contrib.auth.models import AbstractUser

class Patient(AbstractUser):
  phone = models.CharField(max_length=15, unique=True)
  address = models.TextField(max_length=255)

  def __str__(self):
    return self.username
