from django.db import models
from registration_login_system.models import User
from django.utils import timezone
# Create your models here.

class Bidding_vegetable(models.Model):
        UNIT_CHOICES = [
        ('kg', 'Kilogram'),
        ('count', 'Count / Bundle'),
        ('quintal','quintal'),

    ]
        seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bidding_vegetables')
        name = models.CharField(max_length=100)
        variety = models.CharField(max_length=100, blank=True, help_text="E.g. Hybrid, Organic, Local, etc.")
        stock = models.DecimalField(max_digits=10, decimal_places=2, help_text="Stock available (kg or count or quintol)")
        description = models.TextField(blank=True)
        unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
        image = models.ImageField(upload_to='bidding_vegetables_images/', blank=True, null=True)
        is_available = models.BooleanField(default=True)
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)
        min_bid_price = models.DecimalField(
    max_digits=10, 
    decimal_places=2,
    default=0.00,
    help_text="Minimum bidding price"
)


        def __str__(self):
           return f"{self.name} ({self.unit}) - {self.seller.email}"



class SellerCreateBid(models.Model):
    vegetable = models.ForeignKey(Bidding_vegetable, on_delete=models.CASCADE, related_name='bids')
    starting_time = models.DateTimeField(default=timezone.now)
    ending_time = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    @property
    def is_future_bid(self):
        return self.starting_time > timezone.now()

    @property
    def is_expired(self):
        return self.ending_time < timezone.now()

    def __str__(self):
        return f"BID | {self.vegetable.name} | Active: {self.is_active}"

    def __str__(self):
        return f"Bid for {self.vegetable.name} (Seller: {self.vegetable.seller.email})"

class BuyerBid(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="buyer_bids")
    bid = models.ForeignKey(SellerCreateBid, on_delete=models.CASCADE, related_name="buyer_bids")
    bid_price = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    @property
    def highest_bid(self):
        return self.buyer_bids.order_by('-bid_price').first()
    
    @property
    def is_bidding_active(self):
        now = timezone.now()
        return self.starting_time <= now <= self.ending_time

    def __str__(self):
        return f"Bid: ₹{self.bid_price} by {self.buyer.email}"
     
     
