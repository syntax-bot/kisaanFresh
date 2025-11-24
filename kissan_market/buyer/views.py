from django.shortcuts import render
from .util import *
from registration_login_system.models import *
from seller.models import *
# Create your views here.
from django.http import JsonResponse
import json
from decimal import Decimal
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404
from registration_login_system.models import User
from seller.models import Vegetable
from .models import *
from utils.transaction_utility import add_transaction 
import os
from django.conf import settings
import csv
import pandas as pd
from utils.utility_buyer import send_buyer_cancel_email,send_buyer_order_email,send_seller_order_email
@csrf_exempt
@login_required
def nearby_vegetables(request):
    if request.user.role != 'buyer':
       return JsonResponse({'error': 'Only buyers can access this endpoint'}, status=403)
    try:
       buyer = request.user.buyer_profile
    except  Exception:
        return JsonResponse({"error":"Profile Not Found"})

    buyer_lat = buyer.latitude
    buyer_lon = buyer.longitude
    max_distance = 20  # km

    sellers = SellerProfile.objects.all()
    nearby_sellers = []

    for seller in sellers:
        distance = calculate_distance(buyer_lat, buyer_lon, seller.latitude, seller.longitude)
        if distance <= max_distance:
            nearby_sellers.append(seller)

    vegetables = Vegetable.objects.filter(seller__in=[s.user for s in nearby_sellers])

    data = list(vegetables.values())
    return JsonResponse({"vegetables": data})


@csrf_exempt
@login_required
def nearby_vegetables_filter(request):
    if request.user.role != 'buyer':
       return JsonResponse({'error': 'Only buyers can access this endpoint'}, status=403)
    try:
       buyer = request.user.buyer_profile
    except  Exception:
        return JsonResponse({"error":"Profile Not Found"})

    buyer_lat = buyer.latitude
    buyer_lon = buyer.longitude
    max_distance = 20  # km

    sellers = SellerProfile.objects.all()
    nearby_sellers = []

    for seller in sellers:
        distance = calculate_distance(buyer_lat, buyer_lon, seller.latitude, seller.longitude)
        if distance <= max_distance:
            nearby_sellers.append(seller)

    vegetables = Vegetable.objects.filter(seller__in=[s.user for s in nearby_sellers])
    veg_name = request.GET.get("name")
    if veg_name:
        vegetables = vegetables.filter(name__iexact=veg_name)

    return JsonResponse({"vegetables": list(vegetables.values())})





@csrf_exempt
@login_required
def buy_vegetables(request):
    if request.method != "POST":
        return JsonResponse({"error": "Use POST method"}, status=405)

    try:
        data = json.loads(request.body)
        cart_items = data.get("cart", [])
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON data"}, status=400)

    if not cart_items:
        return JsonResponse({"error": "Cart is empty"}, status=400)

    buyer = request.user

    # Group vegetables by seller
    seller_items = {}
    for item in cart_items:
        vegetable = get_object_or_404(Vegetable, id=item["vegetable_id"])
        quantity = Decimal(str(item["quantity"]))

        if vegetable.stock < quantity:
            return JsonResponse({"error": f"Not enough stock for {vegetable.name}"}, status=400)

        seller = vegetable.seller
        seller_items.setdefault(seller, []).append((vegetable, quantity))

    purchase_ids = []

    # Create Purchase per seller
    for seller, items in seller_items.items():
        total_price = sum(veg.price * qty for veg, qty in items)
        purchase = Purchase.objects.create(
            buyer=buyer,
            seller=seller,
            total_price=total_price,
            status="Pending",
        )

        for veg, qty in items:
            PurchaseItem.objects.create(
                purchase=purchase,
                vegetable=veg,
                quantity=qty,
                price_per_unit=veg.price,
                total_price=veg.price * qty,
            )

            # Reduce stock
            veg.stock -= qty
            veg.save()
        send_seller_order_email(seller.email,purchase.id)

        purchase_ids.append(purchase.id)
    send_buyer_order_email(request.user.email,purchase_ids)
    return JsonResponse({
        "message": "Purchase successful!",
        "purchase_ids": purchase_ids,
    })



@csrf_exempt
@login_required
def get_completed_purchases(request):
    """
    Return all completed purchases of the logged-in buyer
    including items, seller, and total price details.
    """
    buyer = request.user  # current logged-in buyer
    
    # Fetch completed purchases
    purchases = Purchase.objects.filter(buyer=buyer, status="Completed").prefetch_related("items__vegetable", "seller")

    purchase_list = []
    for purchase in purchases:
        items = [
            {
                "vegetable_name": item.vegetable.name,
                "quantity": float(item.quantity),
                "price_per_unit": float(item.price_per_unit),
                "total_price": float(item.total_price),
                "item_id":item.id
            }
            for item in purchase.items.all()
        ]

        purchase_list.append({
            "purchase_id": purchase.id,
            "seller_name": purchase.seller.email,
            "total_price": float(purchase.total_price),
            "status": purchase.status,
            "created_at": purchase.created_at.strftime("%Y-%m-%d %H:%M"),
            "items": items
        })

    return JsonResponse({"completed_purchases": purchase_list}, safe=False)

@csrf_exempt
@login_required
def get_pending_orders(request):
    """
    Returns all pending orders for the logged-in buyer.
    """
    buyer = request.user  # logged-in buyer

    pending_orders = Purchase.objects.filter(buyer=buyer, status="Pending").prefetch_related("items__vegetable", "seller")

    order_list = []
    for order in pending_orders:
        items = [
            {
                "vegetable_name": item.vegetable.name,
                "quantity": float(item.quantity),
                "price_per_unit": float(item.price_per_unit),
                "total_price": float(item.total_price),
            }
            for item in order.items.all()
        ]

        order_list.append({
            "purchase_id": order.id,
            "seller_email": order.seller.email,
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "items": items,
        })

    return JsonResponse({"pending_orders": order_list}, safe=False)


# --------------------------------------------------
#  Cancel a Pending Order
# --------------------------------------------------
@csrf_exempt
@login_required
def cancel_order(request, purchase_id):
    """
    Allows buyer to cancel a pending order by purchase_id and restores stock.
    """
    buyer = request.user

    try:
        # Get the purchase belonging to this buyer
        purchase = Purchase.objects.get(id=purchase_id, buyer=buyer)
    except Purchase.DoesNotExist:
        return JsonResponse({"error": "Purchase not found."}, status=404)

    # Only allow cancellation of pending orders
    if purchase.status.lower() != "pending":
        return JsonResponse({"error": "Only pending orders can be cancelled."}, status=400)

    #  Restore stock quantities for all vegetables in this purchase
    for item in purchase.items.all():
        vegetable = item.vegetable
        vegetable.stock += item.quantity  # restore quantity
        vegetable.save()

    #  Mark order as cancelled
    purchase.status = "Cancelled"
    purchase.save()
    
    
    for item in purchase.items.all():

        # If a buyer cancelled, rating is usually None
        review = item.reviews.filter(buyer=purchase.buyer).first()
        rating_value = review.rating if review else None

        transaction_data = {
            "purchase_id": purchase.id,
            "transaction_id": f"{purchase.id}-{item.id}-BUYER-CANCEL",

            # Participant information
            "buyer": purchase.buyer.email,
            "seller": item.vegetable.seller.email,

            # Item details
            "vegetable_name": item.vegetable.name,
            "variety": item.vegetable.variety,
            "quantity": float(item.quantity),
            "total_price": float(item.total_price),

            # Review info
            "rating": rating_value,

            # Cancellation info
            "status": "CancelledByBuyer",
            

            # Timestamp
            "created_at": purchase.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

        add_transaction(transaction_data)
    send_buyer_cancel_email(request.user.email,purchase.id)
    return JsonResponse({
        "message": "Order cancelled successfully and stock restored!",
        "purchase_id": purchase.id,
        "new_status": purchase.status
    })


@csrf_exempt
@login_required
def add_purchase_review(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            purchase_item_id = data.get("purchase_item_id")
            comment = data.get("comment", "").strip()
            rating = int(data.get("rating", 0))

            if not comment:
                return JsonResponse({"error": "Comment cannot be empty."}, status=400)

            if rating < 0 or rating > 5:
                return JsonResponse({"error": "Rating must be between 0 and 5."}, status=400)

            buyer = request.user

            # Check if the purchase item exists and belongs to this buyer
            try:
                purchase_item = PurchaseItem.objects.get(
                    id=purchase_item_id,
                    purchase__buyer=buyer,
                    purchase__status="Completed"
                )
            except PurchaseItem.DoesNotExist:
                return JsonResponse({"error": "Invalid purchase item or not completed yet."}, status=404)

            # Check if review already exists
            if PurchaseReview.objects.filter(buyer=buyer, purchase_item=purchase_item).exists():
                return JsonResponse({"error": "You have already reviewed this item."}, status=400)

            # Create the review
            review = PurchaseReview.objects.create(
                purchase_item=purchase_item,
                buyer=buyer,
                comment=comment,
                rating=rating,
                created_at=timezone.now()
            )

            return JsonResponse({
                "message": "Review added successfully!",
                "review": {
                    "id": review.id,
                    "vegetable_name": purchase_item.vegetable.name,
                    "comment": review.comment,
                    "rating": review.rating,
                    "created_at": review.created_at.strftime("%Y-%m-%d %H:%M"),
                }
            })

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method."}, status=400)


@csrf_exempt
@login_required
def get_transactions_buyer(request):
    # 1. Check if logged-in user is buyer
    if request.user.role != "buyer":
        return JsonResponse({"error": "Access denied. Only buyers can view this."}, status=403)

    # 2. Allow only GET request
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=405)

    buyer=request.user.email
    file_path = os.path.join(settings.MEDIA_ROOT, "transactions", "transactions.csv")
    if not os.path.isfile(file_path):
        return JsonResponse({"transactions": []}, status=200)

    transactions = []

    try:
        # Read CSV using pandas
        df = pd.read_csv(file_path)

        # Filter using pandas
        filtered = df[df["buyer"] == buyer]

        # Convert rows to list of dicts
        result = filtered.to_dict(orient="records")

        return JsonResponse({"transactions": result}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@login_required
@csrf_exempt
def sellers_other_veg(request):
    seller_id=request.Get("id")
    if not seller_id:
        return JsonResponse({"error": "Seller ID required"}, status=400)

    seller = User.objects.filter(id=seller_id).first()
    vegetables = Vegetable.objects.filter(seller=seller)[:4]
    data = list(vegetables.values())
    return JsonResponse({"vegetables": data})
