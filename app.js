var express = require("express");
var path=require('path');
var methodOverride = require("method-override");
var request = require("request");
var nodemailer = require("nodemailer");
var passport = require("passport");
var LocalStrategy  = require("passport-local");
var passportLocalMongoose  = require("passport-local-mongoose");
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var User = require("./user");
var Job = require("./jobteam");

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/dev_coders", function(err)
  {
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("database has been connected!");
    }
  });

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended : true}));
app.use('', express.static(path.join(__dirname + '')));
app.set('views', path.join(__dirname, 'views'));
app.use(require("express-session")({
    secret: "books page",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   next();
});

app.post("/signup" , function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var mobileno = req.body.mobileno;
  var college = req.body.college;
  var course = req.body.group1;
  var message = req.body.message;
  User.register(new User({username : username , email : email , mobileno : mobileno , college : college ,course : course ,message : message}) , password , function(err,user){
    if(err)
    {
      console.log(err);
      return res.render("signup");
    }else{
    passport.authenticate("local")(req,res,function(){
      User.find({username : username} , function(err,user){
         if(err)
         {
          console.log(err);
         }else{
          res.redirect("/");
         }
      });
    });
    }
  });
});




app.post("/login",passport.authenticate("local" , {
   successRedirect : "/",
   failureRedirect : "/login"
}) , function(req,res){
});

app.get("/logout",function(req,res){
   req.logout();
   res.redirect("/");  
});

function isLoggedIn(req,res,next) {
  if(req.isAuthenticated()){
       return next();
  }
  res.render("login");
}


//GOOGLE MAP

app.get("/",function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("home",{data : data});
  }
  });
});




//NODEMAILER USE


app.post("/message", function(req, res){
  var email = req.body.email;
  console.log("==================================================");
  var name = req.body.Name;
  var subject = req.body.subject;
  var msg = req.body.message;
  var data = {name : name , email : email ,subject : subject , message : msg};
  var transporter = nodemailer.createTransport({
        host: 'smtp-mail.outlook.com', //Change HOST
        port:   587,
        secure: false, 
        auth: {
            user: 'robinjain1414@hotmail.com',   // generated ethereal user
            pass: 'robinjain14'                  // generated ethereal password
        },
          connectionTimeout: 2 * 60 * 1000,
    });
    let mailOptions = {
        from: 'robinjain1414@hotmail.com', // sender address
        to: 'robinjain9587@gmail.com', // list of receivers
        subject: 'Hello', // Subject line
        text: 'Hello testing with      '+  name+'    email    '+email+ '       ' + '   subject        '  + subject + '    message          '  +           msg // plain text body
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
      res.redirect("/");
   });
});




app.get("/login" ,function(req,res){
  res.render("login");
});

app.get("/signup" , function(req,res){
  res.render("signup");
});

app.get("/secret" , function(req,res){
  res.send("its my secret");
});

app.get("/courses" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("course",{data : data});
  }
  });
});

app.get("/jobregistration" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("jobregister",{data : data});
  }
  });
});

app.get("/earnregistration" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("earnregistration",{data : data});
  }
  });
});

app.post("/jobregister" , function(req,res){

  var name = req.body.name;
  var fathername = req.body.fathername;
  var email = req.body.email;
  var mobileno = req.body.mobileno;
  var address = req.body.address;
  var city = req.body.city;
  var state = req.body.state;
  var pincode = req.body.pincode;
  var country = req.body.country;
  var peraddress = req.body.peraddress;
  var percity = req.body.percity;
  var perstate = req.body.perstate;
  var perpinocde = req.body.perpinocde;
  var college = req.body.college;
  var degree = req.body.group1;
  var specilization = req.body.group2;
  var startyear = req.body.startyear;
  var endyear = req.body.endyear;
  var designation = req.body.designation;
  var organisation = req.body.organisation;
  var experience = req.body.experience;
  var job = req.body.group3;
  var linkresume = req.body.linkresume ;
  var message = req.body.message;
  var data = {name : name , fathername : fathername , email : email , mobileno : mobileno , address : address , city : city , state : state , pincode : pincode , country : country , peraddress : peraddress , percity : percity , perstate : perstate , perpinocde : perpinocde , college : college , degree : degree , specilization : specilization , startyear : startyear , endyear : endyear , designation : designation , organisation : organisation , experience : experience , job : job , linkresume : linkresume , message : message};
  Job.create(data , function(err, data){
    if(err){
      console.log(err);
    }else{
    
    res.redirect("/");

    }
  });
});


app.get("/introduction" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("introduction",{data : data});
  }
  });
});

app.get("/nodejs" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("nodejs",{data : data});
  }
  });
});

app.get("/python" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("python",{data : data});
  }
  });
});

app.get("/cpp" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("cpp",{data : data});
  }
  });
});


app.get("/android" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("android",{data : data});
  }
  });
});


app.get("/java" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("java",{data : data});
  }
  });
});


app.get("/machine" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("machine",{data : data});
  }
  });
});

app.get("/team" , function(req,res){
   request("https://maps.googleapis.com/maps/api/geocode/json?address=jaypee+institute+of+information+tecnology+noida+sector-62+A-10&key=AIzaSyBfeJEhYBehzdv61AfFCdcqwZ_J2DcrzWM",function(error,response,body){
  if(!error && response.statusCode == 200)
  {
    var parser = JSON.parse(body);
    var lat = (parser["results"][0]["geometry"]["location"]["lat"]);
    var lng = (parser["results"][0]["geometry"]["location"]["lng"]);
    var data = {lat : lat , lng : lng};
    res.render("team",{data : data});
  }
  });
});

app.get("/courseregister" , function(req,res){
  res.render("courseregister");
});

app.listen("1212" , function(req,res){
console.log("server is started");
});