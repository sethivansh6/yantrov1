
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var MessageSchema = new mongoose.Schema({
	name: String,
    email: String,
    subject:String,
    message:String,
    messagedAt: {type: Date, default: Date.now}
});


module.exports = mongoose.model("Message",MessageSchema);
