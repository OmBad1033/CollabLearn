import express from "express";
import { createPost, getPost, requestUploadUrls, getAllPost } from "../controller/postController.js";
import authCheck from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/new", authCheck, createPost);
router.get("/all",authCheck, getAllPost);
router.post("/upload-urls", authCheck, requestUploadUrls);
router.get("/:id", getPost);



export default router;
