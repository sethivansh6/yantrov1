
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
	username: String,
	name: String,
	phone : String,
	education :String,
	date:String,
	isAdmin:{type:Boolean,default:false},
	isSchoolAdmin:{type:Boolean,default:false},
	bought:{
		type:Boolean,
		default:false
	},
	doubts:[{
		type: mongoose.Schema.Types.ObjectId,
		ref:"Doubt"
	}],
	testtaken: [{test:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Test"
		},
		title:String,
	   score:{type:String,default:"none"},
	   fullmarks:{type:String,default:"none"},
	   percentage:{type:String,default:"none"}
		}],

		testtooks:[{
			type: mongoose.Schema.Types.ObjectId,
			ref: "TT"
	       }
	],
	city: String,
	state: String,
	password: String
});
 UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",UserSchema);
