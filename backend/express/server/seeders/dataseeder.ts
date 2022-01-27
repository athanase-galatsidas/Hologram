import Config from '../models/config';
import Post from '../models/post';

const seed = async () => {
	const isSeeded = await Config.findOne({ key: 'isSeeded' });

	if (!isSeeded) {
		console.log('seeding db');

		new Config({
			key: 'isSeeded',
			value: 'true',
		}).save();

		new Post({
			title: 'a fancy cube',
			file: 'cube.glb',
		}).save();

		new Post({
			title: 'cube.glb',
			file: 'cube.glb',
		}).save();

		new Post({
			title: 'abstract art',
			file: 'cube.glb',
		}).save();
	} else {
		console.log('db already seeded');
	}
};

export { seed };
