from django.urls import path
from .views import *

urlpatterns = [
    path("home/",home,name="home"),
    path("adding_veg/",add_bidding_vegetable,name="add_bidding_vegetable"),
    path("bid_veg_data/",get_my_bid_veg,name="get_my_bid_veg"),
    path("Cancel_Bid/<int:bid_id>/",Cancel_bid,name="Cancel_bid"),
    path("check_time/",check_timezone),
    path("get-bids/",get_bids),
    path("create-bid/",create_bid),
    path("nearby/",get_bidding_veg_nearby),
    path("place-bid/",place_bid),
    path("seller_completed_bids/",get_my_completed_bids_seller),
    path("buyer_completed_bids/",get_my_completed_bids_buyer),
    path("get_nearby_upcoming_bids/",get_nearby_upcoming_bids),





]
