import requests
from requests.auth import HTTPBasicAuth
import dotenv
import json
import time
import datetime
import logging

import os
import random

from lhrNetUtils import Config

dotenv.load_dotenv()


def get_resp(lat,long,lat_offset,long_offset,user=None,passwd=None):
    """
    Make a request to the opensky api and return the result, retrys
    every ~10 minutes until successful

    Args:
        lat (float): The lat of the center point
        long (float): The long of the center point
        lat_offset (float): The distance from the center to fetch in one 
            direction (north or south)
        long_offset (float): The distance from the center to fetch in one 
            direction (east or west)
    """
    logging.info(f"Fetching at {datetime.datetime.now()}")
    auth = None
    address = "https://opensky-network.org/api/states/all?"
    if user and passwd:
        auth = HTTPBasicAuth(user, passwd)

    try:
        resp = requests.get(
            address
            + f"lamin={lat-lat_offset:.4f}&lomin={long-long_offset:.4f}&lamax={lat+lat_offset:.4f}&lomax={long+long_offset:.4f}",
            auth=auth,
        )
        resp.raise_for_status()

        logging.info(f"{resp.headers.get("X-Rate-Limit-Remaining")} calls remaining")
    except requests.exceptions.RequestException:
        logging.warning("An error occured waiting ~10 mins")
        time.sleep(600)
        resp = get_resp(lat,long,lat_offset,long_offset,user=user,passwd=passwd)
    return resp

def append_to_json_arr(json_file_path: str,new_obj: dict):
    """
    Open a json file containg a json array append an element and write it back.
    """

    existing_data = []
    if os.path.isfile(json_file_path):
        with open(json_file_path, "r") as f:
            existing_data = json.load(f)

    with open(json_file_path, "w") as f:
        existing_data.append(new_obj)
        json.dump(existing_data, f)


def main():
    config = Config("config.json")
    
    user = os.environ.get("OPEN_SKY_USER")
    passwd = os.environ.get("OPEN_SKY_PASS")
    
    lat = config.get_heathrow_lat()
    long = config.get_heathrow_long()
    
    lat_offset = config.get_lat_offset()
    long_offset = config.get_long_offset()

    while True:
        resp = get_resp(lat,long,lat_offset,long_offset,user=user,passwd=passwd)

        append_to_json_arr("raw_data.json",resp.json())  

        sleep_time = random.randint(50, 500)
        logging.info(f"Sleeping for {sleep_time}")
        time.sleep(sleep_time)

if __name__ == "__main__":
    logging.getLogger().setLevel(logging.INFO)
    main()
