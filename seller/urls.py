from .views import *
from django.urls import path

urlpatterns = [
    path('add_vegetable/', add_vegetable, name='add_vegetable'),
    path('my_vegetables/', get_seller_vegetables, name='get_seller_vegetables'),
    path('edit_vegetable/<int:veg_id>/', edit_vegetable, name='edit_vegetable'),
    path('uncompleted_orders/',seller_orders, name='seller_orders'),
    path('accept_orders/',accept_order, name='accept_order'),
    path('reject_orders/',decline_order, name='decline_order'),
    path('complete_order/<int:purchase_id>/',mark_order_as_completed, name='mark_order_as_completed'),
    path('my_transactions/',get_transactions_seller, name='get_transaction_seller'),





]
