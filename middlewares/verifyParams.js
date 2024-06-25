
import mongoose from "mongoose";
import { closeDbConnection, createDbConnection } from "../configs/db.config.js";
import User from "../models/user.model.js";

const isValidUserIdInTheParams = async (req, res, next) => 
{
    try 
    {
        if (!req.params?.id) 
        {
            return res.status(400).json({
                code: 400,
                status: false,
                message: `${cName} id is required`
            });
        } 
        else 
        {
            await createDbConnection();
            const data = await User.findOne({ _id: req.params?.id });
            if (!data) 
            {
                return res.status(400).send({
                    code: 400,
                    status: false,
                    message: `${cName} not found with the provided params id`
                });
            }
            await closeDbConnection();
            next();
        }
    } 
    catch(err) 
    {
        return res.status(500).json({
            status: false,
            error: err.message
        });
    }
};

export default isValidUserIdInTheParams;
