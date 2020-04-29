
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var NotSchema = new mongoose.Schema({
	message: String,
	link:{
        type:String,
        default:"none"
    }
});
 

module.exports = mongoose.model("Notification",NotSchema);


