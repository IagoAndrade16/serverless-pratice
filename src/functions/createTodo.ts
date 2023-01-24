import { APIGatewayProxyHandler } from "aws-lambda";
import { v4 as uuid } from "uuid";
import { document } from "../utils/dynamoClient";

interface ICreateTodo {
  title: string;
  deadline: string;
}

export const handler: APIGatewayProxyHandler = async (event) => {
  const { title, deadline } = JSON.parse(event.body) as ICreateTodo;
  const { user_id } = event.pathParameters;
  const id = uuid();

  await document.put({
    TableName: "todos",
    Item: {
      id,
      user_id,
      title,
      done: false,
      deadline,
    }
  }).promise()

  const todo = await document.query({
    TableName: "todos",
    KeyConditionExpression: "id = :id",
    ExpressionAttributeValues: {
      ":id": id
    }
  }).promise()

  return {
    statusCode: 201,
    body: JSON.stringify(todo.Items[0])
  }
}