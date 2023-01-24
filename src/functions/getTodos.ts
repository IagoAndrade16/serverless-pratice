import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../utils/dynamoClient";

export const handler: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
 
  const response = await document.query({
    TableName: "todos",
    KeyConditionExpression: "user_id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise();

  if(!response){
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "This user do not exists",
      }),
      headers: {
        "Content-type" : "application/json",
      }
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "TODO List!",
      content:  response,
    }),
    headers: {
      "Content-type": "application/json",
    },
  };
}