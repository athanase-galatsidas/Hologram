import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import axios from 'axios';
import 'dotenv/config';

import cors from 'cors';

// APP
const port = process.env.PORT || 3002;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

const url = process.env.API_URL;

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// SOCKET
io.on('connection', (socket: Socket) => {
	console.log('new socket connection');

	socket.on('disconnect', (reason: any) => {
		console.log('socket disconnecting');
	});

	io.engine.on('connection_error', (err: any) => {
		console.log(err.req);
		console.log(err.code);
		console.log(err.message);
		console.log(err.context);
	});

	socket.on('annotation', (payload: any) => {
		console.log(`received: ${payload.id}, ${payload.message}`);

		axios
			.post(url + '/v1/annotations', {
				id: payload.id,
				message: payload.message,
				x: payload.x,
				y: payload.y,
				z: payload.z,
			})
			.then((res) => {
				console.log(res.data);
				io.sockets.emit(`annotation:${payload.id}`, res.data);
			});
	});
});

// START
httpServer.listen(port, () => {
	console.info(`\nServer listening on ws://localhost:${port}`);
});
