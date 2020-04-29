var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var CourseSchema = new mongoose.Schema({
	code:String,
	classcode:String,
	name: String,
	subjects: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Subject"
	}],
	tests:[{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Test"
	}]
});
 

module.exports = mongoose.model("Course",CourseSchema);
