from .views import *
from django.urls import path

urlpatterns = [
    path('register_seller/',register_seller, name='register_seller'),
    path('verify_seller/',verify_otp, name='verify_otp'),
    path('request_otp_seller/',request_otp, name='request_otp'),
    path('seller_login/',login_seller,name='login_seller'),
    path('seller_logout/',logout_seller,name='logout_seller'),
    path('register_buyer/',register_buyer, name='register_buyer'),
    path('verify_buyer/',verify_otp, name='verify_otp'),
    path('request_otp_buyer/',request_otp, name='request_otp'),
    path('buyer_login/',login_buyer,name='login_buyer'),
    path('buyer_logout/',logout_buyer,name='logout_buyer'),
    path("seller_profile/", seller_profile_view, name="seller_profile"),
    path("buyer_profile/", buyer_profile_view, name="buyer_profile"),
    path("auth/",auth_status,name="auth_status"),



]
