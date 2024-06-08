import express from 'express';
import { verifyJWT } from './controller/auth';
import { getTokenUsage } from './controller/chat';

const router = express.Router();

router.post('/token-usage', verifyJWT, getTokenUsage);

export default router;