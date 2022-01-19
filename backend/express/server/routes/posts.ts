import express, { Request, Response, Router } from 'express';
import models from '../models/posts';

const router = Router();

router.get('/', (req: Request, res: Response) => {});

router.get('/:id', (req: Request, res: Response) => {});

export default router;
