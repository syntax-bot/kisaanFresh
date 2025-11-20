from django.db import models
from registration_login_system.models import User


class Vegetable(models.Model):
    UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('count', 'Count / Bundle'),
    ]

    FRESHNESS_CHOICES = [
        ('Fresh', 'Fresh'),
        ('Average', 'Average'),
        ('Old Stock', 'Old Stock'),
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='vegetables')
    name = models.CharField(max_length=100)
    variety = models.CharField(max_length=100, blank=True, help_text="E.g. Hybrid, Organic, Local, etc.")
    price = models.DecimalField(max_digits=7, decimal_places=2, help_text="Price per unit")
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
    stock = models.DecimalField(max_digits=10, decimal_places=2, help_text="Stock available (kg or count)")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='vegetable_images/', blank=True, null=True)
    freshness_level = models.CharField(max_length=50, choices=FRESHNESS_CHOICES, default='Fresh')
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.unit}) - {self.seller.email}"
