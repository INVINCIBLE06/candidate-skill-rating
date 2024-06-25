import express from 'express';
import { createUser, getUsers, updateUser, deleteUser } from '../controllers/user.controller.js';
import { checkCreateUserBody } from '../middlewares/checkInputAdded.js';
import isValidUserIdInTheParams from '../middlewares/verifyParams.js';

const router = express.Router();

// The below route is for creating user
router.post('/users', checkCreateUserBody, createUser);

// The below user for fetching the user.
router.get('/users', getUsers);
router.put('/users/:id', isValidUserIdInTheParams, updateUser);
router.delete('/users/:id', isValidUserIdInTheParams, deleteUser);

export default router;
