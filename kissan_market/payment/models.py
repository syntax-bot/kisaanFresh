from django.db import models
from registration_login_system.models import SellerProfile,BuyerProfile
from registration_login_system.models import User

# Create your models here.

class Order(models.Model):
    STATUS_CHOICES = [
        ("created", "Created"),                    # local order created before payment
        ("paid", "Paid"),                          # payment captured, pending seller accept
        ("pending_seller_accept", "Pending Seller Accept"),
        ("accepted", "Accepted"),                  # seller accepted, payout scheduled/done
        ("cancelled", "Cancelled"),                # cancelled before acceptance and refunded
        ("completed", "Completed"),                # finished (delivery etc.)
    ]

    buyer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="orders")
    seller = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,related_name="payment_orders" )
    amount = models.PositiveIntegerField(help_text="Amount in paise")
    currency = models.CharField(max_length=8, default="INR")
    created_at = models.DateTimeField(auto_now_add=True)

    # Razorpay payment fields
    razorpay_order_id = models.CharField(max_length=128, null=True, blank=True)
    razorpay_payment_id = models.CharField(max_length=128, null=True, blank=True)
    razorpay_signature = models.CharField(max_length=256, null=True, blank=True)

    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default="created")

    

    def __str__(self):
        return f"Order {self.id} buyer={self.buyer} seller={self.seller} amount={self.amount}"