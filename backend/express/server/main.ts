import express, { Request, Response } from 'express';
import cors from 'cors';

// APP SETUP
const app = express(),
	port = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.json()); // for parsing application/json
app.use(cors());

// ROUTES
app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to HoloGram!');
});

// APP START
app.listen(port, () => {
	console.info(`Server listening on http://localhost:${port}/`);
});
