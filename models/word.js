var mongoose = require('mongoose');

var wordSchema = mongoose.Schema({
	title: String,
	owner: String,
	content: String,
	soLike: Number,
	like: [{
		user: String
	}]
});

module.exports = mongoose.model('Word', wordSchema);