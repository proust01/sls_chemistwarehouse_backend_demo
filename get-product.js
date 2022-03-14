'use strict';
// GET /product/n/{product_id}

const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const _ = require('underscore')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE

module.exports.get = async (event) => {

  try {

    // let query = event.queryStringParameters;
    // let limit = query && query.limit ? parseInt(query.limit) : 5
    let product_id = decodeURIComponent(event.pathParameters.product_id);

    let params = {
        TableName: tableName,
        // Key: {
        //     product_id: product_id,
        // },
        KeyConditionExpression: "product_id = :product_id",
        ExpressionAttributeValues : {
            ":product_id" : product_id
        },
        Limit: 1,
    }

    let data = await dynamodb.query(params).promise();

    if(!_.isEmpty(data.Items)) {
        
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*', // Required for CORS support to work
            'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization, app_user_id', // Required for CORS support to work
            'Access-Control-Allow-Credentials': true // Required for CORS support to work
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
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization, app_user_id', // Required for CORS support to work
                'Access-Control-Allow-Credentials': true // Required for CORS support to work
              },
        }
    }

  } catch (err) {
    
    return {
      statusCode: err.statusCode? err.statusCode : 500,
      headers: {
        'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        'Access-Control-Allow-Credentials': true // Required for CORS support to work
      },
      body: JSON.stringify({ message: err.message }),
    };
  }

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};