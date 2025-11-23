from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime

def send_order_accepted_email(buyer_email, purchase_id):
    subject = "Order Accepted - Kissan Market"
    message = (
        f"Good news! Your order #{purchase_id} has been accepted by the seller.\n\n"
        "Your items are now being processed.\n"
        "You will receive further updates soon.\n\n"
        "Regards,\nKissan Market Team"
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [buyer_email])

def send_order_declined_email(buyer_email, purchase_id):
    subject = "Order Declined - Kissan Market"
    message = (
        f"Your order #{purchase_id} has been declined by the seller.\n\n"
        "You will be refunded (if paid) and no further action is required.\n"
        "You may place a new order with another seller.\n\n"
        "Regards,\nKissan Market Team"
    )
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [buyer_email])
