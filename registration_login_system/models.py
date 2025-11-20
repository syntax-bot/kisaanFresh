from django.db import models
# Create your models here.
from datetime import timedelta
from django.utils import timezone

from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_ROLES = (
        ('seller', 'Seller'),
        ('buyer', 'Buyer'),
    )

    email = models.EmailField(unique=True)
    mobile = models.CharField(max_length=15, unique=True)
    role = models.CharField(max_length=10, choices=USER_ROLES)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'mobile', 'role']

    def __str__(self):
        return f"{self.email} ({self.role})"

class OTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() - self.created_at <= timedelta(minutes=5)


# class Seller(models.Model):
#     email = models.EmailField(unique=True)
#     mobile = models.CharField(max_length=15, unique=True)
#     is_verified = models.BooleanField(default=False)

#     def __str__(self):
#         return f"{self.email} - {self.mobile}"




class SellerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='seller_profile')
    name = models.CharField(max_length=50)
    upi_id = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"SellerProfile: {self.user.email}"


class BuyerProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='buyer_profile')
    name = models.CharField(max_length=50)
    upi_id = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    created_at = models.DateTimeField(auto_now_add=True)

