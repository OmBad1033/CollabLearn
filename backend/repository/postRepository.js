
import { GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynamoClient, TABLES } from "../config/dynamo.js"
import { v4 as uuidv4 } from "uuid";

class PostRepository {
    constructor() {
        this.tableName = TABLES.POSTS;
    }

    async createPost(postData) {
        const timeStamp = new Date().toISOString();
        const post = {
            id: uuidv4(),
            ...postData,
            createdAt: timeStamp,
            updatedAt: timeStamp,
        }

        const params = {
            TableName: this.tableName,
            Item: post,
            ConditionExpression: "attribute_not_exists(id)",
        }

        await dynamoClient.send(new PutCommand(params));
        return post;
    }

    async findPostById(postId) {
        const params = {
            TableName: this.tableName,
            Key: {
                id: postId,
            },
        }

        const result = await dynamoClient.send(new GetCommand(params));
        return result.Item || null;
    }

    async findAllPostByUserId(userId) {
        console.log("before finding the posts")
        const params = {
            TableName: this.tableName,
            IndexName: 'userId-createdAt-index', // have create a GSI for userId
            KeyConditionExpression: 'userId = :uid',
            ExpressionAttributeValues: {
                ":uid": userId
            },
            ScanIndexForward: false // sort by createdAt DESC (latest first)
        }
        const result = await dynamoClient.send(new QueryCommand(params));
        console.log("Result form Repo:",result);
        return result.Items || []
    }

}

export const postRepository = new PostRepository();