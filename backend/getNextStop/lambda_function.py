import json

def getNextBusStop(busNumber, busStopCode):
    with open('Routes.json', 'r') as f:
        data = json.load(f)
    # routes already sorted ascending order
    route = data[busNumber]
    for i in range(len(route)): 
      if route[i]['BusStopCode'] == busStopCode: 
        if route[i]['StopSequence'] < 0: 
          return 0 if i == 0 else route[i - 1]
        else: 
          return 0 if i == len(route) - 1 else route[i + 1]
    return 0

def lambda_handler(event, context):
    body = json.loads(event['body'])
    if "busStopCode" not in body or "busNumber" not in body: 
        return {
            'statusCode': 400, 
            'body': 'Missing params',
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET'
            }
        }
    return {
        'statusCode': 200,
        'body': json.dumps(getNextBusStop(body["busNumber"], body["busStopCode"]))
    }
