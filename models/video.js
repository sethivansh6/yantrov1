
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var VideoSchema = new mongoose.Schema({
	link: String,
	caption: String,
	detail: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chapter"
		},
		course:String,
		chapter: String,
	    subject: String

	}
});
 

module.exports = mongoose.model("Videos",VideoSchema);
