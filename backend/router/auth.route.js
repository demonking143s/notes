import express from 'express';
import {signUp, logIn, logOut, getMe} from '../controller/auth.controller.js'
import producter from '../middleware/producter.js'

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/logout', logOut);
router.get('/getme', producter, getMe);

export default router;