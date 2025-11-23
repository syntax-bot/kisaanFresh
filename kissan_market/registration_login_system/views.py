from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .utility import generate_otp, send_email_otp
from django.contrib.auth import login, logout
from django.utils import timezone
from datetime import timedelta
import json
from django.contrib.auth.decorators import login_required

# ----------------------
# Step 1: Request OTP
# ----------------------
@csrf_exempt
def register_seller(request):
    if request.method == "POST":
        email = request.POST.get("email")
        mobile = request.POST.get("mobile")

        if not email or not mobile:
            return JsonResponse({"error": "Email and mobile are required."})

        role = "seller"  # Fixed role for this endpoint
        # Check if any user exists with same email or mobile
        existing_email = User.objects.filter(email=email, role=role).first()
        existing_mobile = User.objects.filter(mobile=mobile, role=role).first()

        if existing_email and existing_mobile:
            return JsonResponse({"error": "User already exists with this email and mobile number."}, status=409)

        if existing_email:
            return JsonResponse({"error": "User already exists with this email."}, status=409)
        # Check if user already exists with this email
        current_user = User.objects.create(
            email=email,
            mobile=mobile,
            username=email,
            role=role
        )

        
        # Generate and store OTP
        email_otp = generate_otp()
        OTP.objects.create(email=email, otp=email_otp)

        # Send OTP via email
        send_email_otp(email, email_otp)

        return JsonResponse({"message": f"OTP sent to {role}'s email."})

    return JsonResponse({"error": "Invalid request method."})

# ----------------------
# Step 2: Verify OTP
# ----------------------
@csrf_exempt
def verify_otp(request):
    if request.method == "POST":
        email = request.POST.get("email")
        email_otp_entered = request.POST.get("email_otp")

        if not email or not email_otp_entered:
            return JsonResponse({"error": "Email and OTP are required."})

        # 🔹 Determine role from URL
        path = request.path.lower()
        if "seller" in path:
            role = "seller"
        elif "buyer" in path:
            role = "buyer"
        else:
            return JsonResponse({"error": "Invalid verification route."})

        # 🔹 Fetch latest OTP
        otp_obj = OTP.objects.filter(email=email).order_by('-created_at').first()
        if not otp_obj or not otp_obj.is_valid():
            return JsonResponse({"error": "OTP expired or not found. Please request again."})

        # 🔹 Validate OTP
        if otp_obj.otp == email_otp_entered:
            try:
                # Get user with correct role
                user = User.objects.get(email=email, role=role)
                user.is_verified = True
                user.save()
                login(request,user)
                return JsonResponse({
                    "message": f"{role.capitalize()} verified successfully!",
                    "user_id": user.id,
                    "role": user.role
                })
            
            except User.DoesNotExist:
                return JsonResponse({"error": f"No {role} found with this email."})
        else:
            return JsonResponse({"error": "Invalid OTP."})

    return JsonResponse({"error": "Invalid request method."})

@csrf_exempt
def request_otp(request):
    if request.method == "POST":
        print(request.POST.get("email"))
        email = request.POST.get("email")

        if not email:
            return JsonResponse({"error": "Email is required."})

        # Detect role from the API path
        path = request.path.lower()
        required_role = None

        if "seller" in path:
            required_role = "seller"
        elif "buyer" in path:
            required_role = "buyer"

        if not required_role:
            return JsonResponse({"error": "Invalid path — role not identified (must include 'buyer' or 'seller')."})

        # Fetch the user with the correct role
        try:
            user = User.objects.get(email=email, role=required_role, is_verified=True)
        except User.DoesNotExist:
            return JsonResponse({
                "error": f"{required_role.capitalize()} not found or not verified."
            })

        # Generate and save OTP
        otp_code = generate_otp()
        OTP.objects.create(email=email, otp=otp_code)

        # Send OTP email
        send_email_otp(email, otp_code)

        return JsonResponse({
            "message": f"OTP sent successfully to {required_role} email.",
            "role": user.role
        })

    return JsonResponse({"error": "Invalid request method."})

@csrf_exempt
def login_seller(request):
    if request.method == "POST":
        email = request.POST.get("email")
        otp_entered = request.POST.get("otp")

        if not email or not otp_entered:
            return JsonResponse({"error": "Email and OTP are required."})

        try:
            seller = User.objects.get(email=email, is_verified=True, role="seller")
        except User.DoesNotExist:
            return JsonResponse({"error": "Seller not found or not verified."})

        otp_obj = OTP.objects.filter(email=email).order_by('-created_at').first()
        if not otp_obj:
            return JsonResponse({"error": "No OTP found. Please request OTP first."})

        if otp_obj.otp == otp_entered and timezone.now() - otp_obj.created_at <= timedelta(minutes=5):
            login(request, seller)

            response = JsonResponse({
                "authenticated": True,
                "message": "Seller login successful!",
                "seller_id": seller.id,
                "role": seller.role,
            })

            response.set_cookie(
                key="sessionid",
                value=request.session.session_key,
                httponly=True,
                samesite="Lax",
                secure=False,
            )

            return response
        
        return JsonResponse({"error": "Invalid or expired OTP."})

    return JsonResponse({"error": "Invalid request method."})

@login_required
@csrf_exempt
def logout_seller(request):
    if request.method == "POST":
        logout(request)  # destroy session
        return JsonResponse({"message": "Seller logged out successfully!"})
    
    return JsonResponse({"error": "Invalid request method."})

@csrf_exempt
def register_buyer(request):
    if request.method == "POST":
        email = request.POST.get("email")
        mobile = request.POST.get("mobile")

        if not email or not mobile:
            return JsonResponse({"error": "Email and Mobile are required."})
        # Check if any buyer exists with same email or mobile
        existing_email = User.objects.filter(email=email, role="buyer").first()
        existing_mobile = User.objects.filter(mobile=mobile, role="buyer").first()

        if existing_email and existing_mobile:
            return JsonResponse(
                {"error": "Buyer already exists with this email and mobile number."},
                status=409
            )

        if existing_email:
            return JsonResponse(
                {"error": "Buyer already exists with this email."},
                status=409
            )

        if existing_mobile:
            return JsonResponse(
                {"error": "Buyer already exists with this mobile number."},
                status=409
            )

        # Create new buyer
        buyer = User.objects.create(
            email=email,
            mobile=mobile,
            username=email,
            role="buyer",
        )

        
        
        # Generate OTP
        email_otp = generate_otp()

        # Store OTP
        OTP.objects.create(email=email, otp=email_otp)

        # Send OTP via email
        send_email_otp(email, email_otp)

        return JsonResponse({"message": "OTP sent to email for buyer verification."})

    return JsonResponse({"error": "Invalid request method."})


@csrf_exempt
def login_buyer(request):
    if request.method == "POST":
        email = request.POST.get("email")
        otp_entered = request.POST.get("otp")

        if not email or not otp_entered:
            return JsonResponse({"error": "Email and OTP are required."})

        # Check if buyer exists and is verified
        try:
            buyer = User.objects.get(email=email, is_verified=True, role="buyer")
        except User.DoesNotExist:
            return JsonResponse({"error": "Buyer not found or not verified."})

        # Get latest OTP
        otp_obj = OTP.objects.filter(email=email).order_by('-created_at').first()
        if not otp_obj:
            return JsonResponse({"error": "No OTP found. Please request OTP first."})

        # Validate OTP within 5 minutes
        if otp_obj.otp == otp_entered and timezone.now() - otp_obj.created_at <= timedelta(minutes=5):
            login(request, buyer)  # Django session-based login
            return JsonResponse({
                "message": "Buyer login successful!",
                "buyer_id": buyer.id,
                "role": buyer.role
            })
        else:
            return JsonResponse({"error": "Invalid or expired OTP."})

    return JsonResponse({"error": "Invalid request method."})

@login_required
@csrf_exempt
def logout_buyer(request):
    if request.method == "POST":
        logout(request)  # destroy session
        return JsonResponse({"message": "Buyer logged out successfully!"})
    
    return JsonResponse({"error": "Invalid request method."})

@login_required
@csrf_exempt
def buyer_profile_view(request):
    
    if request.user.role != "buyer":
        return JsonResponse({"error": "Access denied. Only buyers can access this page."}, status=403)
    # ------------------------------
    # GET — View buyer profile
    # ------------------------------
    if request.method == "GET":
        try:
            profile = BuyerProfile.objects.get(user=request.user)
            data = {
                "name": profile.name,
                "email": request.user.email,
                "mobile": request.user.mobile,
                "upi_id": profile.upi_id,
                "address": profile.address,
                "latitude": str(profile.latitude),
                "longitude": str(profile.longitude),
                "created_at": profile.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            return JsonResponse({"profile": data})
        except BuyerProfile.DoesNotExist:
            return JsonResponse({"error": "Profile not found."}, status=404)

    # ------------------------------
    # POST — Create buyer profile
    # ------------------------------
    elif request.method == "POST":
        name = request.POST.get("name")
        upi_id = request.POST.get("upi_id")
        address = request.POST.get("address")
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")

        if not all([name, upi_id, address, latitude, longitude]):
            return JsonResponse({"error": "All fields are required."}, status=400)

        profile, created = BuyerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "name": name,
                "upi_id": upi_id,
                "address": address,
                "latitude": latitude,
                "longitude": longitude,
            },
        )

        if not created:
            return JsonResponse({"error": "Profile already exists. Use PUT to update."}, status=400)

        return JsonResponse({"message": "Profile created successfully!"})

    # ------------------------------
    # PUT — Update buyer profile
    # ------------------------------
    elif request.method == "PUT":
        from django.http import QueryDict

        # Parse form-data from PUT body
        put_data = QueryDict(request.body)

        profile = BuyerProfile.objects.filter(user=request.user).first()
        if not profile:
            return JsonResponse({"error": "Profile not found."}, status=404)

        profile.name = put_data.get("name", profile.name)
        profile.upi_id = put_data.get("upi_id", profile.upi_id)
        profile.address = put_data.get("address", profile.address)
        profile.latitude = put_data.get("latitude", profile.latitude)
        profile.longitude = put_data.get("longitude", profile.longitude)
        profile.save()

        return JsonResponse({"message": "Profile updated successfully!"})

    return JsonResponse({"error": "Invalid request method."}, status=405)

@login_required
@csrf_exempt
def seller_profile_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Authentication required. Please log in first."}, status=401)
    if request.user.role != "seller":
        return JsonResponse({"error": "Access denied. Only sellers can access this page."}, status=403)
    # ------------------------------
    # GET — View seller profile
    # ------------------------------
    if request.method == "GET":
        try:
            profile = SellerProfile.objects.get(user=request.user)
            data = {
                "name": profile.name,
                "email": request.user.email,
                "mobile": request.user.mobile,
                "upi_id": profile.upi_id,
                "address": profile.address,
                "latitude": str(profile.latitude),
                "longitude": str(profile.longitude),
                "created_at": profile.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            }
            return JsonResponse({"profile": data})
        except SellerProfile.DoesNotExist:
            return JsonResponse({"error": "Profile not found."}, status=404)

    # ------------------------------
    # POST — Create seller profile
    # ------------------------------
    elif request.method == "POST":
        name = request.POST.get("name")
        upi_id = request.POST.get("upi_id")
        address = request.POST.get("address")
        latitude = request.POST.get("latitude")
        longitude = request.POST.get("longitude")

        if not all([name, upi_id, address, latitude, longitude]):
            return JsonResponse({"error": "All fields are required."}, status=400)

        profile, created = SellerProfile.objects.get_or_create(
            user=request.user,
            defaults={
                "name": name,
                "upi_id": upi_id,
                "address": address,
                "latitude": latitude,
                "longitude": longitude,
            },
        )

        if not created:
            return JsonResponse({"error": "Profile already exists. Use PUT to update."}, status=400)

        return JsonResponse({"message": "Seller profile created successfully!"})

    # ------------------------------
    # PUT — Update seller profile
    # ------------------------------
    elif request.method == "PUT":
        from django.http import QueryDict

        # Parse form-data from PUT body
        put_data = QueryDict(request.body)

        profile = SellerProfile.objects.filter(user=request.user).first()
        if not profile:
            return JsonResponse({"error": "Profile not found."}, status=404)

        profile.name = put_data.get("name", profile.name)
        profile.upi_id = put_data.get("upi_id", profile.upi_id)
        profile.address = put_data.get("address", profile.address)
        profile.latitude = put_data.get("latitude", profile.latitude)
        profile.longitude = put_data.get("longitude", profile.longitude)
        profile.save()

        return JsonResponse({"message": "Profile updated successfully!"})
    return JsonResponse({"error": "Invalid request method."}, status=405)


def auth_status(request):
    print(request.user.is_authenticated,request.user)
    if(request.user.is_authenticated):
        return JsonResponse({
            "authenticated": True,
            "user": {
                "id": request.user.id,
                "email": request.user.email,
            }
        })
    return JsonResponse({
        "error":"Not Authenticated"
    })