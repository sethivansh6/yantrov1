
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var QuestionSchema = new mongoose.Schema({
    ques:String,
    ques_image:{
      type:String,
      default:"none"
    },
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    correct:String,
    solution:{
      type:String,
      default:"none"
    },
    detail: {
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Test"
		},
        test:String,
        subject:String,
        course:String
	},
    
    
});
 

module.exports = mongoose.model("Question",QuestionSchema);
