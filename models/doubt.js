var mongoose = require("mongoose");


var DoubtSchema = new mongoose.Schema({
	doubt:String,
	answer:{
		type:String,
		default:"none"
	},
	chapter:String,
	subject:String,
	course:String,
	username:String,
	isAnswered:
	{
		type:Boolean,
		default:false
	}
});
 

module.exports = mongoose.model("Doubt",DoubtSchema);
