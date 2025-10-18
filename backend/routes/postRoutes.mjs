import express from "express";
import { createPost, getPost } from "../controller/postController.js";
import authCheck from "../middleware/protectedRoute.js";

const router = express.Router();

router.post("/new", authCheck, createPost);
router.get("/:id", getPost);

export default router;
