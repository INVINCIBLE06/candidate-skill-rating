import express from 'express';
import { createUser, getUsers, updateUser, deleteUser, getParticularUser, signIn } from '../controllers/user.controller.js';
import { checkCreateUserBody, checkSignInBody, emailValidation, passwordValidation } from '../middlewares/checkInputAdded.js';
import isValidUserIdInTheParams from '../middlewares/verifyParams.js';

const router = express.Router();

// The below route is for creating user
router.post('/user/create', checkCreateUserBody, emailValidation, passwordValidation, createUser);

// Signin Route
router.post('/user/signin', checkSignInBody, emailValidation, passwordValidation, signIn);

// The below route for fethcing the particualr user details
router.get('/user/:id', isValidUserIdInTheParams("User"), getParticularUser);

// The below user for fetching the user.
router.get('/users', getUsers);

// User updating their particular detail
router.put('/users/:id', isValidUserIdInTheParams("User"), updateUser);

// User deleting the it self
router.delete('/users/:id', isValidUserIdInTheParams("User"), deleteUser);

export default router;
