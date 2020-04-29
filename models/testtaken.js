
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var TestUnderSchema = new mongoose.Schema({
   
		test_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Test"
        },
        user_id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
        },
        
        answers:[{type: mongoose.Schema.Types.ObjectId,
            ref:"Answer"}]
    
    
});
 

module.exports = mongoose.model("TT",TestUnderSchema);
