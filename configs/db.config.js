import mongoose from "mongoose";
import dotenv from "dotenv";
import path from 'path';
import { generateLogs } from "../utils/logger.js";
dotenv.config({ path: './.env' });
let filePath = new URL(import.meta.url).pathname;
let fileName = path.basename(filePath); 

// The below function is for creating the database connection
const createDbConnection = async () => {
    try {
        // Connect to MongoDB
        const dbConnection = await mongoose.connect(process.env.DB_URL);
        if (dbConnection) {
            let message = "Successfully connected to the database"
            // // generateLogs("", true, null, message , "DBConnection", "DBConnectionSuccess", filePath, fileName);
            console.log(message);
            init();
        } else {
            let message = "Failed to connect to the database"
            // generateLogs("", false, null, message, "DBConnection", "DBConnectionError", filePath, fileName);
            console.log(message);
        }
    } 
    catch (error) 
    {
        // generateLogs("", false, null, `Error: ${error.message}`, "DBConnection", "DBConnectionError", filePath, fileName, 500);
    }
}

// Close the MongoDB connection
const closeDbConnection = async () => {
    try 
    {
        await mongoose.connection.close();
        let message = "Disconnected from the database";
        // generateLogs("", true, null, message, "DBConnection", "DBDisconnectionSuccess", filePath, fileName);
        console.log(message);
    } 
    catch (error) 
    {
        // generateLogs("", false, null, `Error: ${error.message}`, "DBConnection", "DBDisconnectionError", filePath, fileName);
    }
};

// Check the state of the connection
const checkDbConnection = () => {
    const isConnected = mongoose.connection.readyState; 
    let message;
    if (isConnected === 1) {
        message = "The database connection is active";
        // generateLogs("", true, null, message, "DBConnection", "DBConnectionStatus", filePath, fileName);
        console.log(message);
        return true;
    } else {
        message = "The database connection is not active";
        // generateLogs("", false, null, message, "DBConnection", "DBConnectionStatus", filePath, fileName);
        console.log(message);
        return false;
    }
};
    
export { createDbConnection, closeDbConnection, checkDbConnection };