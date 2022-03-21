'use strict';
// GET /product/n/{product_id}

const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const _ = require('underscore')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE

module.exports.get = async (event) => {

  let product_id = decodeURIComponent(event.pathParameters.product_id);

  // create params for query data
  let params = {
      TableName: tableName,
      KeyConditionExpression: "product_id = :product_id",
      ExpressionAttributeValues : {
          ":product_id" : product_id
      },
      Limit: 1,
  }

  // query data from DynamoDB
  try {

    let data = await dynamodb.query(params).promise();

    // error handling for getting empty data
    if(!_.isEmpty(data.Items)) {
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization, app_user_id',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify(
            {
              message: data,
              input: event,
            }
          ),
        };
    } else {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization, app_user_id',
                'Access-Control-Allow-Credentials': true
              },
        }
    }

  } catch (err) {
    
    return {
      statusCode: err.statusCode? err.statusCode : 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({ message: err.message }),
    };
  }

};
