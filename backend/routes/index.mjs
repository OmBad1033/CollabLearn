import {Router} from "express"
import authRouter from "./authRoutes.mjs"


const router = Router();

router.use(authRouter);

export default router;