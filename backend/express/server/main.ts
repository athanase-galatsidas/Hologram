import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

import uploadRoute from './routes/upload';
import modelsRoute from './routes/posts';

// APP SETUP
const app = express();
const port = process.env.PORT || 3001;

// const httpsOptions = {
// 	cert: fs.readFileSync(path.join(__dirname, 'ssl', 'server.crt')),
// 	key: fs.readFileSync(path.join(__dirname, 'ssl', 'server.key')),
// };
// const server = https.createServer(httpsOptions, app);

const connectionString = process.env.CONNECTION_STRING as string;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_Pass;

// MIDDLEWARE
app.use(express.json()); // for parsing application/json
app.use('/public', express.static('public')); // static files
app.use(cors());

// ROUTES
app.use('/v1/posts', modelsRoute);
app.use('/v1/upload', uploadRoute);

// DB CONNECTION
mongoose
	.connect(connectionString, {
		authSource: 'admin',
		user: dbUser,
		pass: dbPassword,
		keepAlive: true,
		keepAliveInitialDelay: 300000,
	})
	.then((res: any) => {
		console.info('db connected');
	})
	.catch((err: any) => {
		console.error('db failed to connected');
		console.error(err);
	});

// APP START
app.listen(port as number, '0.0.0.0', () => {
	console.info(`Server listening on http://localhost:${port}/`);
});
