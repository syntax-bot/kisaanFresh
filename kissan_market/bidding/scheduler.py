from django.utils import timezone
from bidding.models import SellerCreateBid, BuyerBid, BidWinner
from apscheduler.schedulers.background import BackgroundScheduler
from django.core.mail import send_mail

def send_winner_email(winner, vegetable, amount):
    """Send email notification to the winning bidder."""
    
    subject = f"🎉 You won the auction for {vegetable.name}!"
    message = (
        f"Congratulations !\n\n"
        f"You have won the auction for:\n\n"
        f"Vegetable: {vegetable.name}\n"
        f"Your Winning Bid: ₹{amount}\n"
        f"Seller: {vegetable.seller.email}\n\n"
        f"The seller will contact you shortly.\n\n"
        f"Thank you for using Kissan Market!"
    )
    
    send_mail(
        subject,
        message,
        "testdjango127@gmail.com",  # FROM email
        [winner.email],            # TO email
        fail_silently=False
    )
    print(f"📧 Email sent to winner: {winner.email}")
def close_expired_bids():
    now = timezone.now()

    # Find expired but still active bids
    expired_bids = SellerCreateBid.objects.filter(
        ending_time__lt=now,
        is_active=True
    )

    print(f"[SCHEDULER] Found {expired_bids.count()} expired bids")

    for bid in expired_bids:
        print(f"\nProcessing expired bid ID: {bid.id} for vegetable → {bid.vegetable.name}")

        # Find highest bidder
        highest_bid = BuyerBid.objects.filter(
            bid=bid
        ).order_by("-bid_price", "-timestamp").first()

        if highest_bid:
            print(f"Highest Bidder Found → {highest_bid.buyer.email} | Amount: {highest_bid.bid_price}")
            if BidWinner.objects.filter(bid=bid).exists():
                print("Winner already exists — skipping...")
                bid.is_active = False
                bid.save()
                continue
                        # Create winner record
            BidWinner.objects.create(
                bid=bid,
                winner=highest_bid.buyer,
                final_amount=highest_bid.bid_price
            )
            send_winner_email(
                winner=highest_bid.buyer,
                vegetable=highest_bid.bid.vegetable,
                amount=highest_bid.bid_price
            )
        else:
            print("No bids were placed for this auction.")

        # Mark bid as closed
        bid.is_active = False
        bid.save()

        print(f"Bid ID {bid.id} CLOSED.\n")

    print("✔ Bidding closure process complete.\n")

def start_scheduler():
    scheduler = BackgroundScheduler()
    scheduler.add_job(close_expired_bids, 'interval', minutes=1)
    scheduler.start()