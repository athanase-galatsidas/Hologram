export default () => {
	const URL = import.meta.env.VITE_API_URL;

	const get = async (url: string) => {
		return fetch(url, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
	};

	const post = async (url: string, data: Object) => {
		return fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		});
	};

	return {
		get,
		post,
		URL,
	};
};
