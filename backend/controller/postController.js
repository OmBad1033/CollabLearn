import { createPost as createPostService, getPostById } from "../services/postService.js";


export const createPost = async (req, res) => {
        console.log("Create post:",req.body);
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

}

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
}