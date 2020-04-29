
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var AnswerSchema = new mongoose.Schema({
    ques:String,
    ques_image:{
      type:String,
      default:"none"
    },
    option1:String,
    option2:String,
    option3:String,
    option4:String,
    opted:{
      type:String,
      default:" "
    },
    correct:String,
    solution:{
      type:String,
      default:"none"
    },
    
		tt_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "TT"
		 },
         test_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Test"
        },
        user_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
        }
});
 

module.exports = mongoose.model("Answer",AnswerSchema);
