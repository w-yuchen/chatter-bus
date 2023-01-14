import json
from botocore.vendored import requests
from .util import getClosestBusStop

def lambda_handler(event, context): 
    if "latitude" not in event or "longitude" not in event: 
        return {
            'statusCode': 400, 
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET'
            }
        }
    latitude = event["latitude"]
    longitude = event["longitude"]
    busStopCode = 12345
    return {
        'statusCode': 200,
        'body': busStopCode,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET'
        }
    }