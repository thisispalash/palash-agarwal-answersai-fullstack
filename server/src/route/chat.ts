import express from 'express';
import { verifyJWT } from './controller/auth';
import { getTokenUsage, startChat } from './controller/chat';

const router = express.Router();

router.post('/token-usage', verifyJWT, getTokenUsage);
router.post('/start', verifyJWT, startChat);

export default router;