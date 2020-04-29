
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var TestSchema = new mongoose.Schema({
	title:String,
	for:String,
	time:Number,
	positive:{
		type:Number,
		default:1
	  },
	  negative:{
		type:Number,
		default:0
	  },
    detail: {
		course_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course"
		},
		subject_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Subject"
		},
        subject:String,
        course:String
	},
    questions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Question"
	}],
    
});
 

module.exports = mongoose.model("Test",TestSchema);
