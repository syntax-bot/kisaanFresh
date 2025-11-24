from django.shortcuts import render

# Create your views here.
# orders/views.py
import json
import hmac
import hashlib
from datetime import timedelta
from django.conf import settings
from django.http import JsonResponse, HttpResponse, HttpResponseBadRequest
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Order
from .razor_pay import get_razorpay_client

# 1) Create order & razorpay order
@csrf_exempt
def create_payment_order(request):
    """
    POST JSON: { "amount": 500.00, "seller_id": <id>, "notes": {...} }
    Returns { order_id, amount, currency, key }
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode())
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    amt = data.get("amount")
    seller_id = data.get("seller_id")
    notes = data.get("notes", {})

    if amt is None or seller_id is None:
        return JsonResponse({"error": "amount and seller_id required"}, status=400)

    # convert to paise if float
    if isinstance(amt, float) or (isinstance(amt, str) and "." in str(amt)):
        amount_paise = int(round(float(amt) * 100))
    else:
        amount_paise = int(amt)

    # create local order in created state
    buyer = request.user if request.user.is_authenticated else None
    # get seller object (use your User model)
    from registration_login_system.models import User
    seller = get_object_or_404(User, id=seller_id)

    local_order = Order.objects.create(
        buyer=buyer,
        seller=seller,
        amount=amount_paise,
        currency="INR",
        notes=notes,
        status="created"
    )

    client = get_razorpay_client()
    razorpay_order = client.order.create({
        "amount": amount_paise,
        "currency": "INR",
        "receipt": f"order_rcpt_{local_order.id}",
        "payment_capture": 1,  # capture immediately into platform merchant
        "notes": {
            "local_order_id": str(local_order.id),
        }
    })

    # save razorpay order id
    local_order.razorpay_order_id = razorpay_order["id"]
    local_order.save()

    return JsonResponse({
        "order_id": razorpay_order["id"],
        "local_order_id": local_order.id,
        "amount": amount_paise,
        "currency": "INR",
        "key": settings.RAZORPAY_KEY_ID,
    })


# 2) Verify payment returned by checkout
@csrf_exempt
def verify_payment(request):
    """
    POST JSON: {razorpay_payment_id, razorpay_order_id, razorpay_signature, local_order_id}
    Verify signature, mark order paid/pending acceptance.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    try:
        data = json.loads(request.body.decode())
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    payment_id = data.get("razorpay_payment_id")
    order_id = data.get("razorpay_order_id")
    signature = data.get("razorpay_signature")
    local_order_id = data.get("local_order_id")

    if not all([payment_id, order_id, signature, local_order_id]):
        return JsonResponse({"error": "Missing fields"}, status=400)

    # verify signature: HMAC_SHA256(order_id + "|" + payment_id)
    msg = order_id + "|" + payment_id
    expected_signature = hmac.new(
        key=bytes(settings.RAZORPAY_KEY_SECRET, "utf-8"),
        msg=bytes(msg, "utf-8"),
        digestmod=hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(expected_signature, signature):
        return JsonResponse({"error": "Signature mismatch"}, status=400)

    # mark local order paid and pending seller acceptance
    local_order = get_object_or_404(Order, id=local_order_id)
    local_order.razorpay_payment_id = payment_id
    local_order.razorpay_signature = signature
    local_order.status = "pending_seller_accept"
    local_order.save()

    return JsonResponse({"status": "ok", "message": "payment verified and order pending seller acceptance"})


# 3) Seller accepts order -> trigger payout to seller (or queue payout)
@csrf_exempt
def seller_accept_order(request, order_id):
    """
    Seller calls this endpoint to accept the order.
    This will release funds (perform payout) or enqueue payout.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    order = get_object_or_404(Order, id=order_id)

    # check auth & role
    user = request.user
    if not user.is_authenticated or user.id != order.seller.id:
        return JsonResponse({"error": "Only seller can accept this"}, status=403)

    if order.status != "pending_seller_accept":
        return JsonResponse({"error": "Order not pending seller acceptance"}, status=400)

    # Option A: use Razorpay Payouts API (recommended) to pay seller instantly
    # NOTE: Razorpay Payouts requires enabling in dashboard and having seller payout details.
    client = get_razorpay_client()

    # Example: create a Payout (this requires Payouts enabled and seller having recipient_id)
    # We assume seller has SellerProfile with `payout_recipient_id` (Razorpay recipient id)
    try:
        sp = order.seller.sellerprofile  # adjust attribute name
    except Exception:
        sp = None

    if sp and getattr(sp, "payout_recipient_id", None):
        # create payout
        payout_amount = order.amount  # in paise
        # build payload per Razorpay Payouts API (fields depend on Razorpay version)
        payout_payload = {
            "account_number": settings.RAZORPAY_ACCOUNT_NUMBER_IF_REQUIRED,  # optional for some configs
            "fund_account_id": sp.payout_recipient_id,
            "amount": payout_amount,
            "currency": "INR",
            "mode": "IMPS",  # NEFT/RTGS/IMPS depending on config
            "purpose": "payout",
            "queue_if_low_balance": True,
            "reference_id": f"payout_order_{order.id}",
            "narration": f"Payout for order {order.id}"
        }
        try:
            payout_resp = client.payout.create(payout_payload)  # method name may differ by SDK version
            # Save payout id & update status
            order.payout_id = payout_resp.get("id")
            order.payout_status = payout_resp.get("status", "created")
            order.status = "accepted"
            order.save()
            return JsonResponse({"status": "ok", "message": "Order accepted and payout initiated", "payout": payout_resp})
        except Exception as e:
            # If payout fails, record and return error (you may want to queue payout)
            return JsonResponse({"error": "payout failed", "detail": str(e)}, status=500)
    else:
        # Option: queue the payout for manual processing or create PayoutRequest model
        order.status = "accepted"
        order.save()
        # create PayoutRequest or notify admin to perform transfer
        return JsonResponse({"status": "ok", "message": "Order accepted; payout queued for admin action"}, status=200)


# 4) Cancel order -> refund buyer if payment captured and order not yet accepted
@csrf_exempt
def cancel_order(request, order_id):
    """
    Buyer or Seller can cancel an order while it's pending_seller_accept.
    If payment captured, refund buyer via Razorpay refund API.
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    order = get_object_or_404(Order, id=order_id)
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Login required"}, status=401)

    # Only allow cancel before acceptance
    if order.status != "pending_seller_accept":
        return JsonResponse({"error": "Cannot cancel this order at this stage"}, status=400)

    # Allow buyer or seller to cancel
    if user.id not in (order.buyer.id if order.buyer else None, order.seller.id if order.seller else None):
        return JsonResponse({"error": "Not allowed to cancel this order"}, status=403)

    # Issue refund via Razorpay
    client = get_razorpay_client()
    try:
        payment_id = order.razorpay_payment_id
        if not payment_id:
            # nothing to refund
            order.status = "cancelled"
            order.save()
            return JsonResponse({"status": "ok", "message": "Order cancelled (no payment to refund)"})
        # Refund full amount; you can customize partial refund amount
        refund_resp = client.payment.refund(payment_id, {"amount": order.amount})
        order.status = "cancelled"
        order.refunded = True
        order.refunded_amount = order.amount
        order.save()
        # store refund details if needed
        return JsonResponse({"status": "ok", "message": "Order cancelled and refund initiated", "refund": refund_resp})
    except Exception as e:
        return JsonResponse({"error": "Refund failed", "detail": str(e)}, status=500)


# 5) Webhook to reconcile events
@csrf_exempt
def razorpay_webhook(request):
    body = request.body
    signature = request.META.get("HTTP_X_RAZORPAY_SIGNATURE")
    webhook_secret = getattr(settings, "RAZORPAY_WEBHOOK_SECRET", None)

    if webhook_secret:
        expected_signature = hmac.new(
            key=bytes(webhook_secret, "utf-8"),
            msg=body,
            digestmod=hashlib.sha256
        ).hexdigest()
        if not signature or not hmac.compare_digest(expected_signature, signature):
            return HttpResponse(status=400)

    try:
        event = json.loads(body.decode())
    except Exception:
        return HttpResponseBadRequest("invalid payload")

    evt_type = event.get("event")
    # handle events:
    if evt_type == "payment.captured":
        payment_entity = event["payload"]["payment"]["entity"]
        order_id = payment_entity.get("order_id")
        # find local order
        local_order = Order.objects.filter(razorpay_order_id=order_id).first()
        if local_order and local_order.status == "created":
            local_order.razorpay_payment_id = payment_entity.get("id")
            local_order.status = "pending_seller_accept"
            local_order.save()

    elif evt_type == "refund.processed":
        # update local order refund status if needed
        pass

    # handle payout events etc.

    return HttpResponse(status=200)
