import express from 'express';
import { checkUser, register, login, session } from './controller/auth';

const router = express.Router();

router.post('/check', checkUser);
router.post('/register', register);
router.post('/login', login);
router.post('/session', session);

export default router;