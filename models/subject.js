
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var SubjectSchema = new mongoose.Schema({
	name:String,
	link:String,
    detail: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course"
		},
		course:String,
	},
    chapters: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Chapters"
	}],
	tests:[{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Test"
	}]
    
});
 

module.exports = mongoose.model("Subject",SubjectSchema);
