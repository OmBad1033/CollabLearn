import { postRepository } from "../repository/postRepository.js";
import { s3Service } from "./s3Service.js";
import { postCreatedEvent } from "../kafka/producers/postProducer.js";
export const createPost = async (userId, postData) => {
  let post = {
    userId,
    content: postData.content,
    title: postData.title,
    assetUrls: postData.assetUrls,
    likesCount: 0,
    commentsCount: 0,
  };
  post = await postRepository.createPost(post);
  try {
    postCreatedEvent(post)
    console.log("🍀Event Sent")
  } catch (error) {
    console.error("💥Failed Connecting to producer");
  }
  return post;
};

export const getPostById = async (postId) => {
  const post = await postRepository.findPostById(postId);
  if (!post) throw new Error("Post not found");
  return post;
};

export const requestUploadUrls = async (userId, files) => {
  const uploadUrlsPromise = files.map(async (file) => {
    const { uploadUrl, key, expiresIn } = await s3Service.generateUploadUrl(
      userId,
      file.fileName,
      file.fileType,
      file.contentType
    );
    return {
      fileName: file.name,
      fileType: file.type,
      uploadUrl,
      key,
      expiresIn,
    };
  });
  return Promise.all(uploadUrlsPromise);
};

export const getAllPostsByUser = async (userId) => {
  console.log("Finding posts by userID");
  const posts = await postRepository.findAllPostByUserId(userId);
  return posts;
};
