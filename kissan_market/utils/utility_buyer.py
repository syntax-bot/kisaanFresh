from django.core.mail import send_mail
from django.conf import settings

def send_buyer_order_email(buyer_email, purchase_ids):
    subject = "Order Placed Successfully - Kissan Market"
    message = (
        "Thank you for your purchase!\n\n"
        f"Your order IDs: {', '.join(map(str, purchase_ids))}\n"
        "The seller will review your order soon.\n\n"
        "Regards,\nKissan Market Team"
    )
    
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [buyer_email])


def send_seller_order_email(seller_email,purchase_id):
    subject = "New Order Received - Kissan Market"
    message = (
        f"You have received a new order \n\n"
        f"Purchase ID's:{purchase_id}\n"
        "Please check your dashboard and accept / decline the order.\n\n"
        "Regards,\nKissan Market Team"
    )

    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [seller_email])

def send_buyer_cancel_email(buyer_email, purchase_id):
    subject = "Order Cancelled - Kissan Market"
    message = (
        f"Your order with ID {purchase_id} has been successfully cancelled.\n\n"
        "The stock has been restored and no further action is required.\n\n"
        "Regards,\nKissan Market Team"
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [buyer_email])