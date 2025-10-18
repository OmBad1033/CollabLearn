
import { GetCommand, PutCommand } from "@aws-sdk/lib-dynamodb";
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

}

export const postRepository = new PostRepository();