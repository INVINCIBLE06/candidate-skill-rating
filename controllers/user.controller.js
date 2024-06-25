import { closeDbConnection, createDbConnection } from '../configs/db.config.js';
import User from '../models/user.model.js';

// Create User
export const createUser = async (req, res, next) => {
    try {
        const { name, role } = req.body;
        await createDbConnection()
        const user = new User({ name, role });
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