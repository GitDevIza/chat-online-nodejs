const mongoose = require('mongoose');
/*mongoose.connect('mongodb://localhost:27017/chat-database',{ useNewUrlParser: true, useUnifiedTopology: true }).then(db => console.log('db is connected')).catch(err => console.log('db connection have error', err));*/

const { Schema, model } = mongoose;

const ChatSchema = new Schema({
	nick: String,
	type_user: String,
	id_box: String,
	msg: String,
	id_sock: String,
	created_at: {
		type: Date,
		default: Date.now
	}
});

module.exports = model('Modelchat', ChatSchema);