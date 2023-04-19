"Login"
import json
import boto3
from boto3.dynamodb.conditions import Key

client = boto3.resource('dynamodb')
client1 = boto3.client('dynamodb')

def lambda_handler(event, context):
    '''Login function'''
    table = client.Table('UsersInfo')

    body = json.loads(event['body'])
    print(body)
    email = body['email']
    password = body['password']

    user_response = {
            'isLoginSuccessful' : False,
            'userInfo' : "",
            'statement' : ''
        }
    print(1, email, password)
    if(email != "" and password != ""):
        response = table.query(
            KeyConditionExpression = Key('type').eq('user') & Key('email').eq(email)
            )  
        statement = table.query(
        KeyConditionExpression = Key('type').eq('transaction') & Key('email').gt(email),
        ScanIndexForward = False,
        Limit = 10
        )
        if response['Count'] != 0:
            user_info = response['Items'][0]
            stored_password = user_info['password']      
            if password == stored_password:
                user_response['isLoginSuccessful'] = True
                user_response['userInfo'] = user_info
                user_response['statement'] = statement['Items']
                del(user_response['userInfo']['password'])

    return {
        'statusCode': 200,
        'body': json.dumps(user_response)
    }
  