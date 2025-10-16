import { Router } from "express";
import authRouter from "./authRoutes.mjs";
import groupRouter from "./groupRoutes.mjs";
import userRouter from "./userRoutes.mjs";
import postRouter from "./postRoutes.mjs";

const router = Router();

router.use("/auth", authRouter);
router.use("/group", groupRouter);
router.use("/user", userRouter);
router.use("/post", postRouter);

export default router;
