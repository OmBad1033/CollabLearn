import express from "express";
import { createPost, getPost, requestUploadUrls } from "../controller/postController.js";
import authCheck from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/new", authCheck, createPost);
router.get("/:id", getPost);
router.post("/upload-urls", authCheck, requestUploadUrls);

export default router;
