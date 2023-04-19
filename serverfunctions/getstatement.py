'''To retrieve statement'''
import json
import boto3
from boto3.dynamodb.conditions import Key
from boto3 import client as boto3_client

client = boto3.resource('dynamodb')
client1 = boto3.client('dynamodb')
lambda_client = boto3_client('lambda')

def lambda_handler(event):
    '''Function body'''
    email = json.loads(event['body'])

    table = client.Table('UsersInfo')

    response = table.query(
        KeyConditionExpression = Key('type').eq('transaction') & Key('email').gt(email),
        ScanIndexForward = False,
        Limit = 10
        )     
    print(response['Items'])
    return {
        'statusCode': 200,
        'body': json.dumps(response['Items'])
    }
 