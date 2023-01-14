import requests


headers = {
    "AccountKey": "NNOj/UqMQF25B3wK5zBTvQ==",
    "accept": "application/json"
}

data = []
skip = 0
url = f'http://datamall2.mytransport.sg/ltaodataservice/BusStops?$skip={skip}'

val = requests.get(url, headers=headers).json()["value"]

while len(val) > 0: 
    for x in val: 
        data.append({
            'Latitude': x['Latitude'], 
            'Longitude': x['Longitude'], 
            'BusStopCode': x['BusStopCode']
        })
    val = requests.get(url, headers=headers).json()["value"]
    skip += 500

print(data)

