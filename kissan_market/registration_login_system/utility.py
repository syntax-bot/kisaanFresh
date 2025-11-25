import random
from django.core.mail import send_mail
import requests
def generate_otp():
    return str(random.randint(100000, 999999))

def send_email_otp(email, otp):
    send_mail(
        'Your Kissan Mart OTP',
        f'Your verification code is {otp}',
        'testdjango127@gmail.com',  # Replace with your sender email
        [email],
        fail_silently=False,
    )



