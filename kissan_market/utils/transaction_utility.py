import csv
import os
from django.conf import settings

def add_transaction(transaction_data):
    folder = os.path.join(settings.MEDIA_ROOT, "transactions")
    os.makedirs(folder, exist_ok=True)

    file_path = os.path.join(folder, "transactions.csv")
    file_exists = os.path.isfile(file_path)
    with open(file_path, "a", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        if not file_exists:
            writer.writerow(transaction_data.keys())
        writer.writerow(transaction_data.values())
 