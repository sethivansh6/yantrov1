
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var ChapterSchema = new mongoose.Schema({
	name: String,
	link:String,
	detail: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subject"
		},
		course:String,
	    subject: String

	},
	videos: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Videos"
	}]
});
 

module.exports = mongoose.model("Chapters",ChapterSchema);


