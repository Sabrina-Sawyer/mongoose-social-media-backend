import { Router } from 'express';

import { thoughtRouter } from './thoughtsRoutes.js';
import { userRouter } from './usersRoutes.js';

const router = Router();

router.use('/thoughts', thoughtRouter);
router.use('/users', userRouter);

export default Router