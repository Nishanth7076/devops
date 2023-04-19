'''verifying accountnumber'''
import json
import boto3
from boto3.dynamodb.conditions import Key
from boto3.dynamodb.conditions import Attr
from boto3 import client as boto3_client

client = boto3.resource('dynamodb')
client1 = boto3.client('dynamodb')
lambda_client = boto3_client('lambda')

def lambda_handler(event):
    '''Money transfers'''
    table = client.Table('UsersInfo')    
    account_number = json.loads(event['body'])

    response = table.scan(
        FilterExpression = Attr('accountNumber').eq(account_number)
        )
    user_response = {
        'userExists' : False,
        'userName' : '',
        'userEmail': ''
    }
    if response['Count'] == 1:
        user_response['userName'] = response['Items'][0]['name']
        user_response['userExists'] = True
        user_response['userEmail'] = response['Items'][0]['email']

    return {
        'statusCode': 200,
        'body': json.dumps(user_response)
    }
