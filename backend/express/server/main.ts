import express, { json, Request, Response } from 'express';
import mongoose from 'mongoose';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname } from 'path';
import cors from 'cors';

// APP SETUP
const app = express();
const port = process.env.PORT || 3001;

// MIDDLEWARE
app.use(express.json()); // for parsing application/json
app.use('/public', express.static('public')); // static files
app.use(cors());

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, 'public'); // sets destination to /public
	},
	filename: (req, file, callback) => {
		// make sure filename is unique
		callback(null, nanoid() + extname(file.originalname));
	},
});
const upload = multer({ storage: storage });

// ROUTES
app.get('/', (req: Request, res: Response) => {
	res.send('Welcome to HoloGram!');
});

app.post('/v1/upload', upload.single('uploaded_file'), (req: Request, res: Response) => {
	console.log(req.file?.filename);
	console.log(req.body?.file_name);

	const file = req.file?.filename; // name of file on disk
	const fileName = req.body?.file_name; // file name chosen by user input field

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
