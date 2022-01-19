import { model, Schema } from 'mongoose';

const schema = new Schema({
	title: String,
	description: String,
	file: String,
	date: {
		type: Date,
		default: Date.now(),
	},
});

export default model('Posts', schema);
