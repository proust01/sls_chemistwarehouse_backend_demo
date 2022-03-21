'use strict';

// POST /product

const AWS = require('aws-sdk')
const { uuid } = require('uuidv4');
AWS.config.update({ region: 'ap-southeast-2' })

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE

module.exports.add = async (event) => {
  
  // create item
  let item = JSON.parse(event.body)
  item.product_id = uuid()
  console.log(item)

  // add to DynamoDB
  try {

    let data = await dynamodb.put({
      TableName: tableName,
      Item: item
    }).promise()

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Accept, Content-Type, Authorization, app_user_id',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify(
        {
          message: item,
          input: data,
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
