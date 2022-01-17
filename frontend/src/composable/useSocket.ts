import { io } from 'socket.io-client';

export default () => {
	const URL = import.meta.env.VITE_SOCKET_URL;

	const socket = io(URL as string);

	return {
		URL,
		socket,
	};
};
