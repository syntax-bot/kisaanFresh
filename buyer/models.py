from django.db import models
from django.utils import timezone
from registration_login_system.models import User
from seller.models import Vegetable
from decimal import Decimal
from django.core.exceptions import ValidationError




class Purchase(models.Model):
    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Processing", "Processing"),
        ("Completed", "Completed"),
        ("Cancelled", "Cancelled"),
    ]

    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="purchases")
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sales")
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="Pending")
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Purchase #{self.id} by {self.buyer.email} from {self.seller.email}"

    @property
    def item_count(self):
        return self.items.count()

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    def update_total_price(self):
        """Recalculate total price when items change"""
        total = sum(item.total_price for item in self.items.all())
        self.total_price = Decimal(total)
        self.save(update_fields=["total_price"])
    
    def clean(self):
        # Ensure buyer and seller have correct roles
        if self.buyer.role != "buyer":
            raise ValidationError("Buyer must have role 'buyer'.")
        if self.seller.role != "seller":
            raise ValidationError("Seller must have role 'seller'.")

        if self.buyer == self.seller:
            raise ValidationError("Buyer and seller cannot be the same user.")

class PurchaseItem(models.Model):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name="items")
    vegetable = models.ForeignKey(Vegetable, on_delete=models.CASCADE, related_name="purchase_items")
    
    quantity = models.DecimalField(max_digits=8, decimal_places=2)  # kg or number
    price_per_unit = models.DecimalField(max_digits=8, decimal_places=2)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        """Auto calculate total price on save"""
        if not self.total_price:
            self.total_price = self.quantity * self.price_per_unit
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.vegetable.name} x {self.quantity} for Purchase #{self.purchase.id}"

class PurchaseReview(models.Model):
    purchase_item = models.ForeignKey(PurchaseItem, on_delete=models.CASCADE, related_name='reviews')
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.PositiveIntegerField(default=0)  # optional
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.buyer.username} on {self.purchase_item.vegetable.name}"
