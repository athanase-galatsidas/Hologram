import express, { Request, Response, Router } from 'express';
import Posts from '../models/post';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
	const data = await Posts.findById(req.body.id);

	if (!data || !req.body.message) {
		res.status(404);
		res.send(JSON.stringify({ error: 'could not find data' }));
	}

	// add annotation
	data.annotations.push({
		message: req.body.message,
		x: req.body.x,
		y: req.body.y,
		z: req.body.z,
	});

	// update post
	await data.save();

	res.status(200);
	res.send(JSON.stringify(data));
});

export default router;
