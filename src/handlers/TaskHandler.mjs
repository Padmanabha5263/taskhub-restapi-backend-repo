// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
  }
};
