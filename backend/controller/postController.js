import {
  createPost as createPostService,
  getPostById,
  requestUploadUrls as requestUploadUrlsService,
  getAllPostsByUser
} from "../services/postService.js";

export const createPost = async (req, res) => {
  console.log("Create post:", req.body);
  const { content, title, assetUrls } = req.body;
  const userId = req.user._id.toString();
  try {
    const post = await createPostService(userId, { content, title, assetUrls });
    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.log("Error while creating post:", error);
    res.sendStatus(500);
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;
  try {
    const post = await getPostById(id);
    res.status(200).json({
      message: "Post fetched successfully",
      post,
    });
  } catch (error) {
    console.log("Error while fetching post:", error);
    res.sendStatus(500);
  }
};

export const requestUploadUrls = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { files } = req.body;
    // Here files = {fileName, fileType, contentType}[]
    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        message: "Files array is required",
      });
    }
    files.forEach(file => {
        if (!file.fileName || !file.fileType || !file.contentType) {
            return res.status(400).json({
                message: "Invalid file",
            });
        }
        
    });
    console.log("Files from the client:",files);
    const uploadUrls = await requestUploadUrlsService(userId, files);
    res.status(200).json({
      message: "Upload urls generated successfully",
      uploadUrls,
    });
  } catch (error) {
    console.log("Error while requesting upload urls:", error);
    res.sendStatus(500);
  }
};

export const getAllPost = async (req, res) => {
  const userId = req.user._id.toString();
  try {
    console.log(userId)
    const posts = await getAllPostsByUser(userId);
    res.status(200).json(posts)

  } catch (error) {
    console.log("Error while getting all posts",error);
    res.sendStatus(500);
  }
}

