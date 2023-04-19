'''This file is used for signing up customers'''
import json
import random
import string
import boto3
from boto3 import client as boto3_client

client = boto3.resource('dynamodb')
dynamodb = boto3.client('dynamodb')
lambda_client = boto3_client('lambda')

def lambda_handler(event):
    "Function for handling signup event"
    body = json.loads(event['body'])
    firstname = body['firstname']
    lastname = body['lastname']
    name = firstname + ' ' + lastname
    email = body['email']
    pincode = body['pincode']
    online_transaction = "false"
    balance = '0'
    password = ''.join(random.choice(string.ascii_uppercase + string.ascii_lowercase + string.digits) for _ in range(10))
    account_num = '393' + ''.join(random.choice(string.digits) for _ in range(8))
    card_num = "0611" + ''.join(random.choice(string.digits) for _ in range(12))
    expiry = str(random.randrange(1,13)).zfill(2)+ str(random.randrange(25,30))
    cvv = str(random.randrange(1,1000)).zfill(3)
    dynamodb.put_item(TableName='UsersInfo', Item={'type':{'S':'user'},'email':{'S': email}, 'name': {'S': name}, 'pincode': {'S': pincode}, 'accountNumber': {'S': account_num }, 'balance': {'S': balance}, 'cvv': {'S': cvv}, 'cardNumber': {'S': card_num}, 'expiry': {'S': expiry}, 'onlineTransactions': {'S': online_transaction}, 'password': {'S': password}})
    msg = {"mailType": "signup", "email": email, "password": password, "name": name}
    lambda_client.invoke(FunctionName="TestMail",
                                           InvocationType='Event',
                                           Payload=json.dumps(msg))

    return {
        'statusCode': 200,
        'body': json.dumps('Hello from ' + firstname + lastname + email)
    }
