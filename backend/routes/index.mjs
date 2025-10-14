import { Router } from "express";
import authRouter from "./authRoutes.mjs";
import groupRouter from "./groupRoutes.mjs";
import userRouter from "./userRoutes.mjs";

const router = Router();

router.use("/auth", authRouter);
router.use("/group", groupRouter);
router.use("/user", userRouter);

export default router;
