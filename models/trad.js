var mongoose=require('mongoose');

var tradSchema=mongoose.Schema({
	title: String,
	owner: String
});

module.exports = mongoose.model('Trad',tradSchema);
