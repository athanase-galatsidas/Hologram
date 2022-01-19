import express, { Request, Response, Router } from 'express';
import multer, { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import { extname } from 'path';
import Post from '../models/posts';

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

const router = Router();

router.post('/', upload.single('uploaded_file'), async (req: Request, res: Response) => {
	if (!req.body.file_name || !req.file) {
		res.status(400);
		res.send(JSON.stringify({ error: 'invalid request data' }));
		return;
	}

	const newPost = new Post({
		title: req.body.file_name,
		// description: req.body.file_description,
		file: req.file.filename,
	});

	newPost
		.save()
		.then((data: any) => {
			console.log(data.title);

			res.status(200);
			res.send(JSON.stringify(newPost));
		})
		.catch((err: any) => {
			console.error(err);
			res.status(400);
			res.send(JSON.stringify({ error: 'something went wrong' }));
		});
});

export default router;
