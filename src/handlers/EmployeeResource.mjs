// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
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

export const employeeHandler = async (event) => {
  if (event.httpMethod === "GET") {
    const params = {
      TableName: "EmployeeTable",
      Key: { EmployeeId: event.pathParameters.id },
    };

    try {
      const data = await ddbDocClient.send(new GetCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify(data.Item),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to get Employee",
          message: error.message,
        }),
      };
    }
  } else if (event.httpMethod === "POST") {
    const body = JSON.parse(event.body);
    const Employee = {
      EmployeeId: `${Date.now()}-${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(4, "0")}`,
      age: body.age,
      email: body.email,
      isActiveEmp: true,
      mobile: body.mobile,
      name: body.name,
    };
    const params = {
      TableName: "EmployeeTable",
      Item: Employee,
    };

    try {
      await ddbDocClient.send(new PutCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify(Employee),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to create employee",
          message: error.message,
        }),
      };
    }
  } else if (event.httpMethod === "PUT") {
    const body = JSON.parse(event.body);
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    Object.keys(body).forEach((key) => {
      // Skip the primary key
      if (key !== "EmployeeId") {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeValues[`:${key}`] = body[key];
        expressionAttributeNames[`#${key}`] = key;
      }
    });
    if (updateExpressions.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No valid fields to update" }),
      };
    }
    const params = {
      TableName: "EmployeeTable",
      Key: {
        EmployeeId: event.pathParameters.id,
      },
      UpdateExpression: `set ${updateExpressions.join(`, `)}`,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ReturnValues: "ALL_NEW", // Returns the item with the updated values
    };

    try {
      const data = await ddbDocClient.send(new UpdateCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Employee item updated",
          data: data.Attributes,
        }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to update employee",
          message: error.message,
        }),
      };
    }
  } else if (event.httpMethod === "DELETE") {
    console.log("DeleteEvent", event);
    const params = {
      TableName: "EmployeeTable",
      Key: { EmployeeId: event.pathParameters.id },
    };

    try {
      await ddbDocClient.send(new DeleteCommand(params));
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "item deleted" }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Failed to delete employee",
          message: error.message,
        }),
      };
    }
  }
};
