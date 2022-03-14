'use strict';
// POST /progress

const AWS = require('aws-sdk')
AWS.config.update({ region: 'ap-southeast-2' })

const dynamodb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE

module.exports.update = async (event) => {

    let course_id = decodeURIComponent(event.pathParameters.course_id)
    console.log(course_id)
    

  try {

    let item = JSON.parse(event.body)
    

    let data = await dynamodb.put({
      TableName: tableName,
      Item: item,
      
    }).promise()

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
