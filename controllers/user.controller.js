import { closeDbConnection, createDbConnection } from '../configs/db.config.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Create User
export const createUser = async (req, res, next) => {
    try {
        const { name, email, role, password } = req.body;
        await createDbConnection()
        const user = new User({ name, role, email, password });
        await user.save();
        await closeDbConnection();
        return res.status(201).json({
            status: true,
            message: `New ${role} is created`
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
};

// Get Users
export const getUsers = async (req, res, next) => {
    try 
    {
        await createDbConnection();
        const users = await User.find();
        await closeDbConnection();
        return res.status(200).json({
            status: true,
            message: "Data fetched successfully",
            data: users
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
};

// Update User
export const updateUser = async (req, res, next) => {
    try {
        await createDbConnection();
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        await closeDbConnection();
        return res.status(200).json({
            message: "Data updated successfully",
            data: user
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
};

// Delete User
export const deleteUser = async (req, res, next) => {
    try {
        await createDbConnection();
        await User.findByIdAndDelete(req.params.id);
        await closeDbConnection();
        return res.status(204).json({
            message: "Data deleted successfully",
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
};

// Get Single User by ID
export const getParticularUser = async (req, res, next) => {
    try 
    {
        await createDbConnection();
        const user = await User.findById(req.params.id);
        await closeDbConnection();

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            status: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (err) {
        return res.status(400).json({
            status: false,
            error: err.message
        });
    }
};

// Sign-in function
export const signIn = async (req, res, next) => {
    const { email, password } = req.body;
    try 
    {
        await createDbConnection();
        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                status: false,
                message: 'Authentication failed. User not found.'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                status: false,
                message: 'Authentication failed. Incorrect password.'
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.SECRET_KEY, { expiresIn: process.env.TOKEN_EXPIRE_TIME });
        await closeDbConnection();
        return res.status(200).json({
            status: true,
            message: 'Authentication successful.',
            token
        });
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: 'Internal server error.',
        });
    }
}