from django.urls import path
from . import views

urlpatterns = [
    #  Nearby vegetables based on location
    path('vegetables/nearby/', views.nearby_vegetables, name='nearby_vegetables'),

    # Buying vegetables (from cart)
    path('vegetables/buy/', views.buy_vegetables, name='buy_vegetables'),

    # Completed purchases
    path('purchases/completed/', views.get_completed_purchases, name='get_completed_purchases'),

    #  Pending orders 
    path('orders/pending/', views.get_pending_orders, name='get_pending_orders'),

    #  Cancel pending order (needs purchase_id)
    path('orders/cancel/<int:purchase_id>/', views.cancel_order, name='cancel_order'),

    #  Add review for a purchased item 
    path('review/add/', views.add_purchase_review, name='add_purchase_review'),
    
    # Get Transactions For Buyer
    path('my_transactions/', views.get_transactions_buyer, name='get_transaction_buyer'),

]
