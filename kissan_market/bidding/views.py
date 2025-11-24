from django.shortcuts import render
from django.http import JsonResponse
from .models import *
import json 
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from registration_login_system.models import *
from buyer.util import *
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
# Create your views here.


def home(request):
    return JsonResponse({"output":"hi"})

@login_required
@csrf_exempt
def add_bidding_vegetable(request):
    print(request.POST)
    if request.method == 'POST':
        try:
            seller = request.user  # Logged-in seller

            # Ensure that only sellers can add vegetables
            if not hasattr(seller, 'role') or seller.role != "seller":
                return JsonResponse({'error': 'Only sellers can add bidding vegetables'}, status=403)

            name = request.POST.get('name')
            variety = request.POST.get('variety', '')
            price=request.POST.get('price')
            unit = request.POST.get('unit', 'kg')
            stock = request.POST.get('stock')
            description = request.POST.get('description', '')
            is_available = request.POST.get('is_available', 'true').lower() == 'true'
            image = request.FILES.get('image')  #  handle uploaded image file

            # Validate required fields
            if not all([name, stock]):
                return JsonResponse({'error': 'name, price, and stock are required'}, status=400)

            # Create the vegetable record
            vegetable = Bidding_vegetable.objects.create(
                seller=seller,
                name=name,
                variety=variety,
                min_bid_price=price,
                unit=unit,
                stock=stock,
                description=description,
                is_available=is_available,
                image=image  
            )

            return JsonResponse({
                'message': 'Bidding Vegetable added successfully!',
                'vegetable_id': vegetable.id,
                'name': vegetable.name
            }, status=201)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


#need_to_make_changes
def edit_bidding_vegetable(request,veg_id):
    if request.method == 'POST':
        try:
            seller = request.user  # Logged-in seller

            # Ensure that only sellers can add vegetables
            if not hasattr(seller, 'role') or seller.role != "seller":
                return JsonResponse({'error': 'Only sellers can edit bidding vegetables'}, status=403)
            try:
                vegetable = Bidding_vegetable.objects.get(id=veg_id, seller=seller)
            except Bidding_vegetable.DoesNotExist:
                return JsonResponse({'error': 'Bidding Vegetable not found or not owned by you'}, status=404)

            vegetable.name = request.POST.get('name')
            vegetable.variety = request.POST.get('variety', '')
            vegetable.price = request.POST.get('price')
            vegetable.unit = request.POST.get('unit', 'kg')
            vegetable.stock = request.POST.get('stock')
            vegetable.description = request.POST.get('description', '')
            vegetable.is_available = request.POST.get('is_available', 'true').lower() == 'true'

            
            vegetable.save()
            return JsonResponse({
                'message': ' Bidding Vegetable updated successfully!',
                'updated_data': {
                    'id': vegetable.id,
                    'name': vegetable.name,
                    'price': float(vegetable.price),
                    'stock': vegetable.stock,
                    'unit': vegetable.unit,
                    'description': vegetable.description,
                    'is_available': vegetable.is_available,
                }
            }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method'}, status=405)


@login_required
@csrf_exempt
def get_my_bid_veg(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    seller = request.user

    if not hasattr(seller, 'role') or seller.role != "seller":
        return JsonResponse({"error": "Only sellers can view this data"}, status=403)

    vegetables = Bidding_vegetable.objects.filter(seller=seller).order_by("-created_at")

    data = []
    for veg in vegetables:
        active_bid = veg.bids.filter(
            is_active=True,
            ending_time__gte=timezone.now()
        ).first()

        data.append({
            "id": veg.id,
            "name": veg.name,
            "variety": veg.variety,
            "min_bid_price": str(veg.min_bid_price),
            "unit": veg.unit,
            "stock": str(veg.stock),
            "description": veg.description,
            "is_available": veg.is_available,
            "created_at": veg.created_at.strftime("%Y-%m-%d %H:%M"),
            
            # New fields for bidding info
            
            "bid_id": active_bid.id if active_bid else None,
            "starting_time": active_bid.starting_time.strftime("%Y-%m-%d %H:%M") if active_bid else None,
            "ending_time": active_bid.ending_time.strftime("%Y-%m-%d %H:%M") if active_bid else None,
        })

    return JsonResponse({"bidding_vegetables": data}, status=200)


@login_required
@csrf_exempt
def Cancel_bid(request, bid_id):
    if request.method != "DELETE":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        # Fetch bid only for logged-in seller
        bid = SellerCreateBid.objects.get(
            id=bid_id,
            vegetable__seller=request.user
        )
    except SellerCreateBid.DoesNotExist:
        return JsonResponse({"error": "Bid not found or unauthorized"}, status=404)

    # Prevent canceling past or active bids
    if not bid.is_future_bid:
        return JsonResponse({
            "error": "You can only cancel future (upcoming) bids!"
        }, status=400)

    # Mark as inactive instead of delete (good business logic)
    bid.is_active = False
    bid.save()

    return JsonResponse({"message": "Bid cancelled successfully!"}, status=200)

from django.http import JsonResponse
from django.utils import timezone

def check_timezone(request):
    return JsonResponse({
        "server_timezone": str(timezone.get_current_timezone()),
        "current_time": timezone.now().strftime("%Y-%m-%d %H:%M:%S")
    })


@login_required
@csrf_exempt
def create_bid(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    import json

    data = json.loads(request.body.decode("utf-8"))

    vegetable_id = data.get("vegetable_id")
    start = data.get("starting_time")
    end = data.get("ending_time")
    print(vegetable_id,start,end)

    try:
        veg = Bidding_vegetable.objects.get(id=vegetable_id, seller=request.user)
    except Bidding_vegetable.DoesNotExist:
        return JsonResponse({"error": "Vegetable not found or not yours"}, status=404)

    bid = SellerCreateBid.objects.create(
        vegetable=veg,
        starting_time=start,
        ending_time=end,
        is_active=True
    )

    return JsonResponse({"message": "Bid created!", "bid_id": bid.id}, status=201)

def get_bids(request):
    for i in SellerCreateBid.objects.all():
           print(i.starting_time)
    return JsonResponse({"data":SellerCreateBid.objects.all()})


@login_required
@csrf_exempt
def get_bidding_veg_nearby(request):
    user = request.user

    # Only buyers allowed
    if not hasattr(user, 'role') or user.role != "buyer":
        return JsonResponse({"error": "Only buyers can view bidding vegetables"}, status=403)
    try:
        buyer_profile = BuyerProfile.objects.get(user=user)
    except BuyerProfile.DoesNotExist:
        return JsonResponse({"error": "Please complete your profile first!"}, status=404)
    buyer_lat = float(buyer_profile.latitude)
    buyer_lon = float(buyer_profile.longitude)

    now = timezone.now()
    result = []
    for veg in Bidding_vegetable.objects.filter(is_available=True):
        # Get active bid for vegetable
        bid = veg.bids.filter(
            is_active=True,
            starting_time__lte=now,
            ending_time__gte=now
        ).first()
        if not bid:
            continue 
        seller = veg.seller
        seller_profile =SellerProfile.objects.get(user=seller)
        if not seller_profile:
            continue # skip without active bid
        dist=calculate_distance(buyer_lat, buyer_lon,float(seller_profile.latitude),float(seller_profile.longitude))
        if dist <= 20:
            result.append({
                "vegetable_id": veg.id,
                "name": veg.name,
                "min_bid_price": str(veg.min_bid_price),
                "unit": veg.unit,
                "image": veg.image.url if veg.image else None,
                "stock": str(veg.stock),
                "description": veg.description,
                "distance_km": round(dist, 2),
                "bid_id": bid.id,
                "ending_time": bid.ending_time.strftime("%Y-%m-%d %H:%M:%S"),
            })

    return JsonResponse({"live_bidding": result}, status=200)


@login_required
@csrf_exempt
def place_bid(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    bid_id = data.get("bid_id")
    amount = data.get("amount")
    try:
        amount = float(amount)
    except (TypeError, ValueError):
        return JsonResponse({"error": "Invalid amount"}, status=400)

    try:
        bid_obj = SellerCreateBid.objects.get(id=bid_id, is_active=True)
    except SellerCreateBid.DoesNotExist:
        return JsonResponse({"error": "Bid not found or inactive"}, status=404)

    now = timezone.now()
    if not (bid_obj.starting_time <= now <= bid_obj.ending_time):
        return JsonResponse({"error": "Bidding not active"}, status=400)

    # Check amount > current highest or > min
    current_max = BuyerBid.objects.filter(bid=bid_obj).order_by('-bid_price').first()
    min_required = float(bid_obj.vegetable.min_bid_price)
    current_max_amount = float(current_max.bid_price) if current_max else 0.0
    if amount <= max(min_required, current_max_amount):
        return JsonResponse({"error": "Bid must be greater than current highest and minimum"}, status=400)

    # Create bid
    new_bid = BuyerBid.objects.create(buyer=request.user, bid=bid_obj, bid_price=amount)

    # After creating, compute new highest
    highest = BuyerBid.objects.filter(bid=bid_obj).order_by('-bid_price', 'timestamp').first()
    highest_amount = float(highest.bid_price)

    # Broadcast update to channel group for this vegetable
    channel_layer = get_channel_layer()
    payload = {
        "vegetable_id": bid_obj.vegetable.id,
        "bid_id": bid_obj.id,
        "new_highest_bid": highest_amount,
        "highest_bidder": request.user.email,
        "timestamp": new_bid.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    }

    async_to_sync(channel_layer.group_send)(
        f"bid_{bid_obj.vegetable.id}",
        {
            "type": "broadcast_bid",
            "payload": payload,
        }
    )

    return JsonResponse({"message": "Bid placed successfully!", "highest": highest_amount}, status=201)