'''Forgot password'''
import json
import boto3
from boto3.dynamodb.conditions import Key
from boto3 import client as boto3_client

client = boto3.resource('dynamodb')
client1 = boto3.client('dynamodb')
lambda_client = boto3_client('lambda')

def lambda_handler(event):
    '''Function body'''
    table = client.Table('UsersInfo')
    email= json.loads(event['body'])
    response = table.query(
        KeyConditionExpression = Key('type').eq('user') & Key('email').eq(email)
        )

    user_exists = response['Count'] 
    is_successful = False

    if user_exists == 1:
        print(1)
        user = response['Items'][0]
        name = user['name']
        email = user['email']
        password = user['password']
        msg = {"mailType": "forgotpassword", "email": email, "password": password, "name": name}
        lambda_client.invoke(FunctionName="TestMail",
                                          InvocationType='Event',
                                          Payload=json.dumps(msg))
        is_successful = True

    return {
        'statusCode': 200,
        'body': json.dumps(is_successful)
    }
