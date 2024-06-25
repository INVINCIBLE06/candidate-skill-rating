import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes.js';
import questionRoutes from './routes/question.routes.js';
import { checkDbConnection, closeDbConnection, createDbConnection } from './configs/db.config.js';

const app = express();

await createDbConnection()
await checkDbConnection();
await closeDbConnection();


app.use(bodyParser.json());
app.use('/api', userRoutes);
app.use('/api', questionRoutes);

export default app;