'use strict';
// GET /products

const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE

module.exports.get = async (event) => {

  // create params for query
  let params = {
      TableName: tableName,
  }

  // query all products
  try {

    // method for concatenate seperate dynamodb results
    const scanResults = [];
    let items;
    do{
        items =  await dynamodb.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey !== "undefined");
    
    const data = scanResults;

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
