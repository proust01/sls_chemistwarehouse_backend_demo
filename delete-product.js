'use strict';
// GET /product/n/{product_id}

const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const _ = require('underscore')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE

module.exports.delete = async (event) => {

  // get product id from params
  let product_id = decodeURIComponent(event.pathParameters.product_id);

  // create params for dynamoDB
  let params = {
      TableName: tableName,
      Key: {
          product_id: product_id,
    },
  }

  // delete data
  try {

    let data = await dynamodb.delete(params).promise();

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
