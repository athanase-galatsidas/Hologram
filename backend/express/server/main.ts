import express, { json, Request, Response } from 'express';
import cors from 'cors';

// APP SETUP
const app = express();
const port = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.json()); // for parsing application/json
app.use('/public', express.static(`${__dirname}/public`)); // testing ar js
app.use(cors());

// ROUTES
app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to HoloGram!');
});

app.post('/v1/upload', (req: Request, res: Response) => {
	console.log(req.headers);
	console.log(req.body);

	const data = {
		status: 'ok',
	};

	res.status(200);
	res.send(JSON.stringify(data));
});

// APP START
app.listen(port, () => {
	console.info(`Server listening on http://localhost:${port}/`);
});
