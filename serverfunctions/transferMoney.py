'''Transfer Money function'''
import json
import boto3
from boto3.dynamodb.conditions import Key
from boto3 import client as boto3_client

client = boto3.resource('dynamodb')
client1 = boto3.client('dynamodb')
dynamodb = boto3.client('dynamodb')
lambda_client = boto3_client('lambda')

def lambda_handler(event, context):
    '''Transfer money between accounts'''
    body = json.loads(event['body'])
    recipient_email = body['recipientemail']
    sender_email = body['senderemail']
    amount = int(body['amount'])

    table = client.Table('UsersInfo')

    response = table.query(
        KeyConditionExpression = Key('type').eq('user') & Key('email').eq(senderEmail)
        )
        
    respone1 = table.query(
        KeyConditionExpression = Key('type').eq('user') & Key('email').eq(recipientEmail)
        )

    user_info = response['Items'][0]
    user_info1 = respone1['Items'][0]

    balance = int(user_info['balance'])
    balance1 = int(user_info1['balance'])

    recipient_account_number = user_info1['accountNumber']

    sender_account_number = user_info['accountNumber']

    if balance > amount:
        balance = balance - amount
        balance = str(balance)
        table.update_item(
        Key = {
            'type' : 'user',
            'email' : sender_email
        },
        UpdateExpression = 'SET #attr1 = :val1',
        ExpressionAttributeNames = {'#attr1' : 'balance'},
        ExpressionAttributeValues = {':val1' : balance}
        )

        balance1 = balance1 + amount
        balance1 = str(balance1)

        table.update_item(
        Key = {
            'type' : 'user',
            'email' : recipient_email
        },
        UpdateExpression = 'SET #attr1 = :val1',
        ExpressionAttributeNames = {'#attr1' : 'balance'},
        ExpressionAttributeValues = {':val1' : balance1}
        )

        user_response = {
        'isTransferSuccessful': True,
        'senderBalance': balance
    }
    msg = { "senderAccountNumber" : sender_account_number, "senderEmail":sender_email, "recipientAccountNumber":recipient_account_number, "recipientEmail": recipient_email, "amount": amount, "type": 'transfer'}
    lambda_client.invoke(FunctionName="createTransaction",
                                           InvocationType='Event',
                                           Payload=json.dumps(msg))        
    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
        'body': json.dumps(user_response)
    }
 