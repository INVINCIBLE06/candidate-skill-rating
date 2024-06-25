
import express from 'express';
import { createOrUpdateResponse, getAggregateRatings } from '../controllers/question.controller.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

router.post('/questions', auth, createOrUpdateResponse);
router.get('/questions/aggregate', auth, getAggregateRatings);

export default router;
