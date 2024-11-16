import requests
from requests.auth import HTTPBasicAuth
import dotenv
import json
import time
import datetime

import os
import random

from lhrNetUtils import Config

dotenv.load_dotenv()


config = Config("config.json")

user = os.environ.get("OPEN_SKY_USER")
passwd = os.environ.get("OPEN_SKY_PASS")

address = "https://opensky-network.org/api/states/all?"

lat = config.get_heathrow_lat()
long = config.get_heathrow_long()

Alat = config.get_lat_offset()
Along = config.get_long_offset()

print(f"{long-Along:.4f},{lat-Alat:.4f},{long+Along:.4f},{lat+Alat:.4f}")


def get_resp():
    print(f"Fetching at {datetime.datetime.now()}")
    auth = None
    if user and passwd:
        auth = HTTPBasicAuth(user, passwd)

    try:
        resp = requests.get(
            address
            + f"lamin={lat-Alat:.4f}&lomin={long-Along:.4f}&lamax={lat+Alat:.4f}&lomax={long+Along:.4f}",
            auth=auth,
        )

        resp.raise_for_status()

        print(resp.headers.get("X-Rate-Limit-Remaining"), " calls remaining")
    except Exception:
        print("An error occured waiting 10 mins")
        time.sleep(600)
        resp = get_resp()

    return resp


while True:
    resp = get_resp()

    existing_data = []
    if os.path.isfile("raw_data.json"):
        with open("raw_data.json", "r") as f:
            existing_data = json.load(f)

    with open("raw_data.json", "w") as f:
        existing_data.append(resp.json())
        json.dump(existing_data, f)

    sleep_time = random.randint(50, 500)
    print(f"Sleeping for {sleep_time}")
    time.sleep(sleep_time)
