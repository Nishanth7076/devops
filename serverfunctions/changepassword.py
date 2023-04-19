'''Function for changing password'''
import json
import boto3
from boto3.dynamodb.conditions import Key

client = boto3.resource('dynamodb')
client1 = boto3.client('dynamodb')

def lambda_handler(event):
    '''Function body'''
    body = json.loads(event['body']) 
    table = client.Table('UsersInfo')

    email = body['email']
    old_password = body['old']
    new_password = body['new']
    confirm_new_password = body['renew']

    response = table.query(
        KeyConditionExpression = Key('type').eq('user') & Key('email').eq(email)
        )

    user_response = {
        'isChangeSuccessful' : False,
    }

    user_info = response['Items'][0]
    stored_password = user_info['password']

    if((old_password == stored_password) and (new_password == confirm_new_password)):
        response = table.update_item(
        Key = {
            'type' : 'user',
            'email' : email
        },
        UpdateExpression = 'SET #attr1 = :val1',
        ExpressionAttributeNames = {'#attr1' : 'password'},
        ExpressionAttributeValues = {':val1' : new_password}
        )
        user_response['isChangeSuccessful'] = True

    return {
        'statusCode': 200,
        'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
                    },
        'body': json.dumps(user_response)
    }