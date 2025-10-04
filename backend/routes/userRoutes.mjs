import express from "express"
import authCheck from "../middleware/protectedRoute";

const router = express.Router();

router.post("/follow/:id", authCheck, )



