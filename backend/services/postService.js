import {postRepository} from "../repository/postRepository.js";

export const createPost = async (userId, postData) => {
    const post = {
        userId,
        content: postData.content,
        title: postData.title,
        assetUrls: postData.assetUrls,
        likesCount: 0,
        commentsCount: 0,
    }
  
  return postRepository.createPost(post);
};

export const getPostById = async (postId) => {
  const post = await postRepository.findPostById(postId);
  if(!post) throw new Error("Post not found");
  return post;
};
