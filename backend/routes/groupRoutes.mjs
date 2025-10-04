import { Router } from "express";
import authCheck from "../middleware/protectedRoute.js";
import { createGroup, listAllGroups } from "../controller/groupController.js";

const router = Router();

router.post("/new", authCheck, createGroup);
router.get("/list", authCheck, listAllGroups);

export default router;
