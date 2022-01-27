import { model, Schema } from 'mongoose';

const schema = new Schema({
	key: String,
	value: String,
});

export default model('Config', schema);
