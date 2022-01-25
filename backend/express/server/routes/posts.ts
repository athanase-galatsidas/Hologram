import express, { Request, Response, Router } from 'express';
import Posts from '../models/post';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const data = await Posts.find();

	if (!data) {
		res.status(404);
		res.send(JSON.stringify({ error: 'could not find data' }));
		return;
	}

	res.status(200);
	res.send(JSON.stringify(data));
});

router.get('/:id', async (req: Request, res: Response) => {
	const data = await Posts.findById(req.params.id);

	if (!data) {
		res.status(404);
		res.send(JSON.stringify({ error: 'could not find data' }));
	}

	res.status(200);
	res.send(JSON.stringify(data));
});

export default router;
