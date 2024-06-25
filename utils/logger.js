import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const { createLogger, format, transports } = winston;
const { combine, timestamp, printf } = format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This is the path for defining the log directory locally
const logsDir = path.join(__dirname, '../../Logs');

// Function to ensure the log directory exists
const ensureLogDirectory = (folderName) => {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;
    const logDir = path.join(logsDir, formattedDate, folderName);

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    return logDir;
};

const generateLogs = ({
    request = {},
    status,
    response,
    message = '',
    folderName,
    logFileName,
    filename = '',
    filepath = '',
    code = ''
}) => {
    const logDir = ensureLogDirectory(folderName);
    const myFormat = printf(({ timestamp }) => {
        const logTime = new Date(timestamp).toLocaleTimeString();
        return JSON.stringify({
            API: request.url || '',
            filename,
            filepath,
            Method: request.method || '',
            Code: code,
            Status: status ?? '',
            Message: message,
            Request: request,
            Response: response,
            Time: logTime
        }, null, 2); // Add indentation for readability
    });

    const fileInitial = "File Nem";
    const date = new Date();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    // Include a timestamp in the filename to create a new log file each time
    const logFilename = `${fileInitial}_${logFileName}_${hours}${minutes}${seconds}.log`;
    const logFilePath = path.join(logDir, logFilename);
    const logger = createLogger({
        format: combine(timestamp(), myFormat),
        transports: [new transports.File({ filename: logFilePath })],
    });

    const log = () => {
        logger.log({
            level: 'info',
            request,
            response,
        });
    };

    // Call the log function
    log();
};

export { generateLogs };
