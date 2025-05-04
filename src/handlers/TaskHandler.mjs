// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { uniqueIdGenerator } from "./utils/common.mjs";

let client;
if (process.env.ISLocal) {
  client = new DynamoDBClient({
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
      sessionToken: process.env.SESSION_TOKEN,
    },
  });
} else {
  client = new DynamoDBClient({});
}

const ddbDocClient = DynamoDBDocumentClient.from(client);

// const tableName = process.env.SAMPLE_TABLE;

export const TasksLambdaHandler = async (event) => {
  if (event.httpMethod === "GET") {
    const params = {
      TableName: "task",
      IndexName: "userid-index", // Name of your GSI
      KeyConditionExpression: "userid = :userId",
      ExpressionAttributeValues: {
        ":userId": event.pathParameters.UserId,
      },
    };

    try {
      const data = await ddbDocClient.send(new QueryCommand(params));
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.Items),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to get Tasks",
          message: error.message,
        }),
      };
    }
  } else if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    const taskParam = {
      id: uniqueIdGenerator().toString(),
      userid: body.userid.toString(),
      description: body.description.toString(),
      taskname: body.taskname.toString(),
    };
    console.log("taskParam", taskParam);
    const params = {
      TableName: "task",
      Item: taskParam,
    };

    try {
      await ddbDocClient.send(new PutCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify(taskParam),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to create task",
          message: error.message,
        }),
      };
    }
  }
};
