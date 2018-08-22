var mongoose = require("mongoose");

JobSchema = new mongoose.Schema({
   name : String,
   fathername : String,
   email :    String,
   mobileno : Number,
   address : String,
   city : String,
   State : String,
   pincode : Number,
   country : String,
   peraddress : String,
   percity : String,
   perstate : String,
   perpincode : Number,
   college : String,
   degree : String,
   specilization : String,
   startyear:Number,
   endyear : Number,
   designation : String,
   organisation : String,
   experience : Number,
   job : String,
   linkresume : String,
   message : String
});

module.exports = mongoose.model("Job",JobSchema);