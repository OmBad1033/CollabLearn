import { Router } from "express";
import authRouter from "./authRoutes.mjs";
import groupRouter from "./groupRoutes.mjs";

const router = Router();

router.use("/auth", authRouter);
router.use("/group", groupRouter);

export default router;
