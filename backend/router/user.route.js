import express from 'express';

import producter from '../middleware/producter.js'
import { getProfile, updateUser } from '../controller/user.controller.js';

const router = express.Router();

router.get('/profile/:username', producter, getProfile);
router.post('/update', producter, updateUser);

export default router;