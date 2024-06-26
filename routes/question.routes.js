
import express from 'express';
import { createOrUpdateResponse, getAggregateRatings, getParticularUserAllResponse, submitRating } from '../controllers/question.controller.js';
import { auth } from '../middlewares/auth.js';
import isValidUserIdInTheParams from '../middlewares/verifyParams.js';
import { submitRatingBody } from '../middlewares/checkInputAdded.js';

const router = express.Router();

// The below function 
router.get('/questions/aggregate',  auth, getAggregateRatings)

// The below route is for adding candidate response
router.post('/questions/response', auth, createOrUpdateResponse);

// The below route is for get all the response of a particular user.
router.get('/questions/getAllResponseOfParticularUser/:id', auth, isValidUserIdInTheParams("Candidate"), getParticularUserAllResponse);

// The below route is for submitting rating by the reviewsS
router.put('/questions/submitRating/:id', auth, isValidUserIdInTheParams("Question"), submitRatingBody, submitRating);


export default router;
