import { Router } from "express";

import { thoughtRouter } from "./thoughtsRoutes";
import { userRouter } from "./usersRoutes";

const router = Router();

router.use("/thoughts", thoughtRouter);
router.use("/users", userRouter);

export default Router