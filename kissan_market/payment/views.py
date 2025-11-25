# views.py
import razorpay
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Order
import json

@csrf_exempt
def create_razorpay_order(request):
    """Step 1: Buyer clicks Buy -> create local order + Razorpay order"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)

    buyer = request.user
    seller_id = data.get("seller_id")
    amount = data.get("amount")      # in paise
    
    if not seller_id or not amount:
        return JsonResponse({"error": "Missing seller_id or amount"}, status=400)

    # Create local order first
    order = Order.objects.create(
        buyer=buyer,
        seller_id=seller_id,
        amount=amount,
        status="created"
    )

    # Create Razorpay order
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    razorpay_order = client.order.create({
        "amount": amount,             # paise
        "currency": "INR",
        "receipt": str(order.id),
    })

    order.razorpay_order_id = razorpay_order["id"]
    order.save()

    return JsonResponse({
        "order_id": order.id,
        "razorpay_order_id": razorpay_order["id"],
        "razorpay_key": settings.RAZORPAY_KEY_ID,
        "amount": amount,
        "currency": "INR",
    })



@csrf_exempt
def verify_payment(request):
    """Step 3: Razorpay sends payment info -> verify signature -> update order"""
    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=405)

    data = json.loads(request.body)

    order_id = data.get("order_id")
    razorpay_order_id = data.get("razorpay_order_id")
    razorpay_payment_id = data.get("razorpay_payment_id")
    razorpay_signature = data.get("razorpay_signature")

    order = Order.objects.get(id=order_id)

    # Create Razorpay client
    client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    try:
        # Razorpay utility for signature verification
        client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
    except:
        return JsonResponse({"error": "Payment verification failed"}, status=400)

    # If signature valid -> save info
    order.razorpay_order_id = razorpay_order_id
    order.razorpay_payment_id = razorpay_payment_id
    order.razorpay_signature = razorpay_signature
    order.status = "paid"
    order.save()

    return JsonResponse({"success": True})

