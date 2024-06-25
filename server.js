import app from "./app.js";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './env/local.env' });

let PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});