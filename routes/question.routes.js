
import express from 'express';
import { candidateReponse, createOrUpdateResponse, getAggregateRatings, getParticularUserAllResponse, submitRating } from '../controllers/question.controller.js';
import { auth } from '../middlewares/auth.js';
import isValidUserIdInTheParams from '../middlewares/verifyParams.js';

const router = express.Router();

// router.post('/questions', auth, createOrUpdateResponse);
router.post('/questionsresponse', auth, candidateReponse);
router.get('/questions/getAllResponseOfParticularUser/:id', auth, isValidUserIdInTheParams("Candidate"), getParticularUserAllResponse);
router.put('/questions/submitRating/:id', auth, isValidUserIdInTheParams("Question"), submitRating);


export default router;
