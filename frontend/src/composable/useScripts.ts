export default () => {
	const loadScript = (url: string) => {
		const script = document.createElement('script');
		script.setAttribute('src', url);
		document.head.appendChild(script);
	};

	return {
		loadScript,
	};
};
