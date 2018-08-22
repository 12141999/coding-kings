var mongoose = require("mongoose");
var passport = require("passport");
var passportLocalMongoose  = require("passport-local-mongoose");

UserSchema = new mongoose.Schema({
   username : String,
   password : String,
   email :    String,
   mobileno : Number,
   college : String,
   course : String,
   message : String
});

UserSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User",UserSchema);