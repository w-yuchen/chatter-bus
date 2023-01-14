import requests
from geopy.distance import distance
import json
from dotenv import load_dotenv
import os

def getClosestBusStop(latlon = (1.30637, 103.77337)):
    with open('BusStops.json', 'r') as f:
        data = json.load(f)
    bs = [
        (
            distance((x['Latitude'], x['Longitude']), latlon).m,
            x['BusStopCode']
        )
        for x in data
    ]
    bs.sort()
    return bs[0]

def getArrivalTime(busStop = '17099') -> list:
    """_summary_

    Args:
        busStop (str, optional): code. Defaults to '17099'.

    Returns:
        list: list of arriving buses
    """
    load_dotenv()
    headers = {
        "AccountKey": os.getenv("DATAMALL_API_KEY"),
        "accept": "application/json"
    }
    url = 'http://datamall2.mytransport.sg/ltaodataservice/BusArrivalv2'
    params = {"BusStopCode": busStop}
    content = requests.get(url, headers=headers, params=params).json()["Services"]
    return content