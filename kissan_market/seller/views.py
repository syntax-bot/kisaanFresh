from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from registration_login_system.models import User
from .models import Vegetable
from django.contrib.auth.decorators import login_required
from buyer.models import *
import json
from utils.transaction_utility import add_transaction
import os
import pandas as pd
from django.conf import settings
import csv
from pathlib import Path
from utils.utility_seller import send_order_accepted_email,send_order_declined_email
@csrf_exempt
@login_required

@csrf_exempt
def add_vegetable(request):
    if request.method == 'POST':
        try:
            seller = request.user  # Logged-in seller

            # Ensure that only sellers can add vegetables
            if not hasattr(seller, 'role') or seller.role != "seller":
                return JsonResponse({'error': 'Only sellers can add vegetables'}, status=403)

            name = request.POST.get('name')
            variety = request.POST.get('variety', '')
            price = request.POST.get('price')
            unit = request.POST.get('unit', 'kg')
            stock = request.POST.get('stock')
            description = request.POST.get('description', '')
            freshness_level = request.POST.get('freshness_level', 'Fresh')
            is_available = request.POST.get('is_available', 'true').lower() == 'true'
            image = request.FILES.get('image')  # ✅ handle uploaded image file

            # Validate required fields
            if not all([name, price, stock]):
                return JsonResponse({'error': 'name, price, and stock are required'}, status=400)

            # Create the vegetable record
            vegetable = Vegetable.objects.create(
                seller=seller,
                name=name,
                variety=variety,
                price=price,
                unit=unit,
                stock=stock,
                description=description,
                freshness_level=freshness_level,
                is_available=is_available,
                image=image  
            )

            return JsonResponse({
                'message': 'Vegetable added successfully!',
                'vegetable_id': vegetable.id,
                'name': vegetable.name
            }, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@csrf_exempt
@login_required
def get_seller_vegetables(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required. Please log in first."}, status=401)

    if request.method == 'GET':
        seller = request.user

        # Ensure the logged-in user is a seller
        if not hasattr(seller, 'role') or seller.role != "seller":
                return JsonResponse({'error': 'Only sellers can view their vegetables'}, status=403)

        # Get all vegetables for this seller
        vegetables = Vegetable.objects.filter(seller=seller)

        # Prepare response data
        veg_list = []
        for veg in vegetables:
            veg_list.append({
                'id': veg.id,
                'name': veg.name,
                'variety': veg.variety,
                'price': float(veg.price),
                'unit': veg.unit,
                'stock': veg.stock,
                'description': veg.description,
                'freshness_level': veg.freshness_level,
                'is_available': veg.is_available,
                'created_at': veg.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            })

        return JsonResponse({'vegetables': veg_list}, status=200)

    return JsonResponse({'error': 'Invalid request method'}, status=405)




@csrf_exempt
@login_required
def edit_vegetable(request, veg_id):
    if request.method == 'PUT':
        try:
            seller = request.user

            # Ensure the logged-in user is a Seller
            if not hasattr(seller, 'role') or seller.role != "seller":
                return JsonResponse({'error': 'Only sellers can edit their vegetables'}, status=403)
            # Get the vegetable belonging to this seller
            try:
                vegetable = Vegetable.objects.get(id=veg_id, seller=seller)
            except Vegetable.DoesNotExist:
                return JsonResponse({'error': 'Vegetable not found or not owned by you'}, status=404)
            
            data = json.loads(request.body)

            # Update only provided fields
            vegetable.name = data.get('name', vegetable.name)
            vegetable.variety = data.get('variety', vegetable.variety)
            vegetable.price = data.get('price', vegetable.price)
            vegetable.unit = data.get('unit', vegetable.unit)
            vegetable.stock = data.get('stock', vegetable.stock)
            vegetable.description = data.get('description', vegetable.description)
            vegetable.freshness_level = data.get('freshness_level', vegetable.freshness_level)
            vegetable.is_available = data.get('is_available', vegetable.is_available)

            vegetable.save()

            return JsonResponse({
                'message': 'Vegetable updated successfully!',
                'updated_data': {
                    'id': vegetable.id,
                    'name': vegetable.name,
                    'price': float(vegetable.price),
                    'stock': vegetable.stock,
                    'unit': vegetable.unit,
                    'description': vegetable.description,
                    'freshness_level': vegetable.freshness_level,
                    'is_available': vegetable.is_available,
                }
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



@csrf_exempt
@login_required
def seller_orders(request):
    """Return all pending or processing orders for the logged-in seller."""
    try:
        seller = request.user  # Assuming the logged-in user is a seller

        # Filter orders related to this seller’s vegetables that are not completed
        pending_orders = PurchaseItem.objects.filter(
            vegetable__seller=seller,
            purchase__status__in=['Pending', 'Processing']
        ).select_related('purchase', 'vegetable', 'purchase__buyer')

        data = []
        for item in pending_orders:
            data.append({
                "purchase_id": item.purchase.id,
                "vegetable_name": item.vegetable.name,
                "quantity": item.quantity,
                "total_price": item.total_price,
                "status": item.purchase.status,
                "buyer_name": item.purchase.buyer.username,
                "ordered_at": item.purchase.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            })

        return JsonResponse({"orders": data}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
@login_required
def accept_order(request,purchase_id):
    """Seller accepts a pending order (changes status to processing)."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            purchase_id = data.get("purchase_id")

            if not purchase_id:
                return JsonResponse({"error": "purchase_id is required."}, status=400)

            seller = request.user # current logged-in seller

            # Check if this order belongs to the seller
            purchase = Purchase.objects.filter(
                id=purchase_id,
                items__vegetable__seller=seller,
                status="Pending"
            ).distinct().first()

            if not purchase:
                return JsonResponse({"error": "Order not found or not pending."}, status=404)

            # Update order status
            purchase.status = "Processing"
            purchase.save()

            return JsonResponse({
                "message": "Order accepted successfully.",
                "purchase_id": purchase.id,
                "new_status": purchase.status
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    send_order_accepted_email(purchase.buyer.email,purchase.id)
    return JsonResponse({"error": "Invalid request method."}, status=405)


@csrf_exempt
@login_required
def decline_order(request,purchase_id):
    """Seller declines a pending order (marks it as cancelled and restores stock)."""
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            purchase_id = data.get("purchase_id")
            reason = data.get("reason", "No reason provided")

            if not purchase_id:
                return JsonResponse({"error": "purchase_id is required."}, status=400)

            seller = request.user  # Logged-in seller

            # Find the purchase that belongs to this seller and is still pending
            purchase = Purchase.objects.filter(
                id=purchase_id,
                items__vegetable__seller=seller,
                status="Pending"
            ).distinct().first()

            if not purchase:
                return JsonResponse({"error": "Order not found or not pending."}, status=404)

            #  Restore stock for all vegetables in this order
            for item in purchase.items.all():
                veg = item.vegetable
                veg.stock_quantity += item.quantity
                veg.save()

            #  Mark order as cancelled
            purchase.status = "Cancelled"
            purchase.save()
            

            for item in purchase.items.all():
                # Review for cancelled items = None
                
                rating_value = 0

                transaction_data = {
                    "purchase_id": purchase.id,
                    "transaction_id": f"{purchase.id}-{item.id}-CANCEL",  # unique for cancelled
                    "buyer": purchase.buyer.email,
                    "seller": seller.email,

                    # Item details
                    "vegetable_name": item.vegetable.name,
                    "variety": item.vegetable.variety,
                    "quantity": float(item.quantity),
                    "total_price": float(item.total_price),

                    # Review info
                    "rating": rating_value,  # Usually None when cancelled

                    # Cancellation info
                    "status": "Cancelled",
                    

                    # Timestamp
                    "created_at": purchase.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                }

                add_transaction(transaction_data)
            send_order_declined_email(purchase.buyer.email,purchase.id)
            return JsonResponse({
                "message": "Order declined successfully and stock restored.",
                "purchase_id": purchase.id,
                "new_status": purchase.status,
                "reason": reason
            }, status=200)

        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON data."}, status=400)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)



@csrf_exempt
@login_required
def mark_order_as_completed(request, purchase_id):
    """
    Allows seller to mark a 'Processing' order as 'Completed'
    once delivery is done.
    """
    try:
        seller = request.user  # current logged-in seller
        purchase = Purchase.objects.get(id=purchase_id, seller=seller)
    except Purchase.DoesNotExist:
        return JsonResponse({"error": "Purchase not found or unauthorized."}, status=404)

    # Only allow marking 'Processing' orders as 'Completed'
    if purchase.status != "Processing":
        return JsonResponse({"error": "Only processing orders can be marked as completed."}, status=400)

    purchase.status = "Completed"
    purchase.save()

    items = purchase.items.all()
    for item in items:
        review = item.reviews.filter(buyer=purchase.buyer).first()
        rating = review.rating
        transaction_data = {
            "purchase_id": purchase.id,
            "transaction_id": f"{purchase.id}-{item.id}",   # unique per item
            "buyer": purchase.buyer.email,
            "seller": purchase.seller.email,
            "total_price": float(item.total_price),
            "quantity": float(item.quantity),
            "vegetable_name": item.vegetable.name,
            "status": purchase.status,
            "created_at": purchase.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "variety": item.vegetable.variety,
            "rating":rating   

        }
        add_transaction(transaction_data)



    return JsonResponse({
        "message": "Order marked as completed successfully!",
        "purchase_id": purchase.id,
        "new_status": purchase.status
    })



@csrf_exempt
@login_required
def get_transactions_seller(request):
    # 1. Check if logged-in user is buyer
    if request.user.role != "seller":
        return JsonResponse({"error": "Access denied. Only sellers can view this."}, status=403)

    # 2. Allow only GET request
    if request.method != "GET":
        return JsonResponse({"error": "Only GET method is allowed"}, status=405)

    seller=request.user.email
    file_path = os.path.join(settings.MEDIA_ROOT, "transactions", "transactions.csv")
    if not os.path.isfile(file_path):
        return JsonResponse({"transactions": []}, status=200)

    transactions = []

    try:
        # Read CSV using pandas
        df = pd.read_csv(file_path)

        # Filter using pandas
        filtered = df[df["seller"] == seller]

        # Convert rows to list of dicts
        result = filtered.to_dict(orient="records")

        return JsonResponse({"transactions": result}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



@csrf_exempt
@login_required
def get_completed_purchases(request):
    """
    Return all completed purchases of the logged-in seller
    including items, seller, and total price details.
    """
    seller = request.user  # current logged-in buyer
    
    # Fetch completed purchases
    purchases = Purchase.objects.filter(seller=seller, status="Completed").prefetch_related("items__vegetable", "buyer")

    purchase_list = []
    for purchase in purchases:
        items = [
            {
                "vegetable_name": item.vegetable.name,
                "quantity": float(item.quantity),
                "price_per_unit": float(item.price_per_unit),
                "total_price": float(item.total_price)
            }
            for item in purchase.items.all()
        ]

        purchase_list.append({
            "purchase_id": purchase.id,
            "buyer_name": purchase.buyer.email,
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
    Returns all pending orders for the logged-in seller.
    """
    seller = request.user # logged-in buyer

    pending_orders = Purchase.objects.filter(seller=seller, status="Pending").prefetch_related("items__vegetable", "seller")

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
            "buyer_email": order.buyer.email,
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "items": items,
        })

    return JsonResponse({"pending_orders": order_list}, safe=False)

@csrf_exempt
@login_required
def get_processing_orders(request):
    """
    Returns all pending orders for the logged-in seller.
    """
    seller = request.user # logged-in buyer

    processing_orders = Purchase.objects.filter(seller=seller, status="Processing").prefetch_related("items__vegetable", "seller")

    order_list = []
    for order in processing_orders:
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
            "buyer_email": order.buyer.email,
            "total_price": float(order.total_price),
            "status": order.status,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M"),
            "items": items,
        })

    return JsonResponse({"processing_orders": order_list}, safe=False)


def get_msp(request):
    file_path = Path(settings.BASE_DIR) / "utils" / "Commodity-wise-MSP-Trend.csv"
    df = pd.read_csv(file_path)
    data = df[["Crop", "2025-26-MSP"]].to_dict(orient="records")
    print(df.head())
    return JsonResponse({"msp_data": data}, safe=False, status=200)


