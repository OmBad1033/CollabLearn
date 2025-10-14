import express from "express"
import authCheck from "../middleware/protectedRoute.js";
import { follow } from "../controller/userController.js";

const router = express.Router();

router.post("/follow/:id", authCheck, follow)

export default router;



