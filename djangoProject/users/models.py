from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    # Establish a one-to-one relationship with the User model
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=15, help_text='Enter a valid phone number.')
    address = models.TextField(help_text='Enter the complete address.')
    pincode = models.CharField(max_length=10, help_text='Enter the postal code.')
    city = models.CharField(max_length=100, help_text='Enter the city name.')
    country = models.CharField(max_length=100, help_text='Enter the country name.')

    class Meta:
        verbose_name = 'User Profile'
        verbose_name_plural = 'User Profiles'
        ordering = ['user__username']  # Order by username for better readability

    def __str__(self):
        return self.user.username
