import express, { Request, Response } from 'express';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';

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

const url = `ws://localhost:${port}`;

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

	socket.on('comment', (payload: any) => {
		// socket.emit(`comment:${payload.id}`, 'test');
		console.log(`received: ${payload.id}`);

		io.sockets.emit(`comment:${payload.id}`, 'test');
		io.sockets.emit('test', 'this is a test');
	});
});

// START
httpServer.listen(port, () => {
	console.info(`\nServer listening on ${url}`);
});
