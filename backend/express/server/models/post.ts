import { model, Schema } from 'mongoose';

const schema = new Schema({
	title: String,
	file: String,
	date: {
		type: Date,
		default: Date.now(),
	},
	annotations: [],
});

export default model('Posts', schema);
