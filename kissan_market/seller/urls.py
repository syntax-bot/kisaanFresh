from .views import *
from django.urls import path

urlpatterns = [
    path('add_vegetable/', add_vegetable, name='add_vegetable'),
    path('my_vegetables/', get_seller_vegetables, name='get_seller_vegetables'),
    path('edit_vegetable/<int:veg_id>/', edit_vegetable, name='edit_vegetable'),
    path('uncompleted_orders/',seller_orders, name='seller_orders'),
    path('accept_orders/<int:purchase_id>/',accept_order, name='accept_order'),
    path('reject_orders/<int:purchase_id>/',decline_order, name='decline_order'),
    path('complete_order/<int:purchase_id>/',mark_order_as_completed, name='mark_order_as_completed'),
    path('my_transactions/',get_transactions_seller, name='get_transaction_seller'),
    path('purchases/completed/',get_completed_purchases, name='get_completed_purchases'),
    path('orders/pending/',get_pending_orders, name='get_pending_orders'),
    path('orders/processing/',get_processing_orders, name='get_processing_orders'),
    path('get_msp/',get_msp,name='get_msp')
    





]
