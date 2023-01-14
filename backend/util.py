import requests
from geopy import distance
import json

def getClosestBusStop(latlon = (1.30637, 103.77337)):
    with open('BusStops.json', 'r') as f:
        data = json.load(f)
    bs = [
        (
            distance.distance((x['Latitude'], x['Longitude']), latlon).m,
            x['BusStopCode']
        )
        for x in data
    ]
    bs.sort()
    return bs[0]