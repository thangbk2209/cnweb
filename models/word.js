var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
	title: String,
	owner: String,
	content: String,
	soLike: Number,
	soCmt: Number,
	like: [{
		user: String,
		avatar: String,
	}],
	comment:[{
		user: String,
		avatar: String,
		cmt: String
	}]
});

module.exports = mongoose.model('Word', wordSchema);