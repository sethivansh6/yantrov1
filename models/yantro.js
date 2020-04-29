
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var YantroSchema = new mongoose.Schema({
    del1:String,
    del2:String,
    del3:String,
    taluka:String,
    district:String,
    phno:String,
    schoolname:String,
    schoolemail:String
});
 

module.exports = mongoose.model("Yantro",YantroSchema);
