var express                   = require("express"),
    app                       = express(),
    bodyParser                = require("body-parser"),
    nodemailer                = require("nodemailer"),
    mongoose                  = require("mongoose"),
	  flash                     = require("connect-flash"),
	  passport                  = require("passport"),
	  bodyParser                = require("body-parser"),
	  LocalStrategy             = require("passport-local"),
    passportLocalMongoose     = require("passport-local-mongoose"), 
    methodOverride            = require("method-override"),   
    User                      = require("./models/user"),
    Message                   = require("./models/message"),
    Course                    = require("./models/courses"),
    Subject                   = require("./models/subject"),
    Chapters                  = require("./models/chapter"),
    Videos                    = require("./models/video"),
    Test                      = require("./models/test"),
    Question                  = require("./models/question"),
    Doubt                     = require("./models/doubt"),
    Yantro                    = require("./models/yantro"),
    Answer                    = require("./models/answer"),
    TT                        = require("./models/testtaken"),
    Notification              = require("./models/notification");
    cloudinary                = require('cloudinary').v2,
    path                      = require("path");
    var foundTest;
    var tt_id;
    
  


    app.set("view engine","ejs");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(`${__dirname}/public`));
    app.use(methodOverride("_method"));


    //========Mongoose Connection=========

    mongoose.connect("mongodb+srv://vansh7:Password12$@yantromitra-hkvgy.mongodb.net/test?retryWrites=true&w=majority",{useUnifiedTopology: true, useNewUrlParser: true});
    
    //mongoose.connect("mongodb://localhost/yantromitra",{useUnifiedTopology: true, useNewUrlParser: true});
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    //=====================================


    app.use(require("express-session")({
      secret: "Blah Blah",
      resave: false,
      saveUninitialized: false
    }));

    //========Passport Configuration========
    app.use(passport.initialize());
    app.use(passport.session());
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    //========================================

    //========= flash message ==========
     app.use(flash());

     app.use(function(req, res, next){
      res.locals.currentUser = req.user;
      res.locals.error = req.flash("error");
      res.locals.success = req.flash("success");
      next();
    });


    //=================================
    //=======IMAGE CODE UPLOADS========
    //=================================

    var multer = require('multer');
var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})


cloudinary.config({ 
  cloud_name: 'ddlxlne6k', 
  api_key: '773777794947995', 
  api_secret: '8vOPCNy496bfbxWAOxBh6jauPE4'
});

 //======================================
 //=======IMAGE CODE UPLOADS Ends========
 //======================================




    app.get('/', function(req, res) {

      Course.find({},function(err,course){
        if(err)
        {
          console.log(err);
          res.render("error.ejs");
        }
        else
        {
          Notification.find({},function(err,not){
            if(err)
            {
              console.log(err);
              res.redirect("back");
            }
            else{
              res.render("index",{course:course,not:not});
            }
          });
        }
      });
    
     });

     //===============================================
     //===========TEST Routes=========================
     //===============================================
     app.get("/showforuser/:user_id",isLoggedIn,function(req,res){
       User.findById(req.params.user_id).populate("testtakens").exec(function(err,user){
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else
         {
         // console.log(user);
          //console.log("dbvvvvvvvvvvvvvvvvvvvv"+user.testtaken);
          user.testtaken.forEach(function(t){
            console.log(t.test.for);
          })
           res.render("admin/showtaken",{user:user});
           
         }
       })
     })

     app.get("/showtestforcourse/:course_id/subject/:id",isLoggedIn,function(req,res){

      Subject.find({"detail.id":req.body.course_id},function(err,sub){

       Test.find({"detail.subject_id":req.params.id},function(err,test){

        if(err){
          console.log(err);
          res.render("error");
        }
        else{
          Subject.findById(req.params.id,function(err,subject){

        res.render("courses/showtest",{test:test,sub:sub,subject:subject});
          });
        }
       });
      });
     });
     //showing test;
     var id;
     app.get("/subject/test/:id",function(req,res){
      /// console.log("here")

       Test.findById(req.params.id).populate("questions").exec(function(err,test)
       {
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else{
           id=req.params.id;
          // console.log(test);
           foundTest=test;
           res.redirect("/showpage");
         }

        });
     });

     app.get("/showpage",isLoggedIn,function(req,res){
       let flag=0;
      Test.findById(id,function(err,test)
      {
          User.findById(req.user._id,function(err,user){

            user.testtaken.forEach(function(t){
              if(t.test._id == id)
              {
               // flag=1;
                console.log("found");
              }
            });
            if(flag==0){
              res.render("test/testpage",{test:test});
              }
              else
              {
                req.flash("success","You have already given this test!")
                res.redirect("/solutions/"+id);
              }

          });
      });
    });
     

     //fetch
     app.get("/gettestdata",function(req,res)
     {
       console.log("here i found "+foundTest)
      res.send(JSON.stringify(foundTest));
     })

     /////===============================
     app.post("/savescorefortest/:test_id/user/:user_id",function(req,res)
     {
       var score=req.body.score;
       User.findById(req.params.user_id,function(err,user){
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else{
           Test.findById(req.params.test_id,function(err,test){

            var obj={
              test:req.params.test_id,
              title:test.title,
              score:score,
              fullmarks:req.body.fullmarks,
              percentage:req.body.percentage
            };
            user.testtaken.push(obj);
            user.save();
            console.log("user is "+user);
            //res.redirect("back");

           });           
         }
       })

     });

     //show solutions

     app.get("/solutions/:test_id",isLoggedIn,function(req,res)
     {
       Test.findById(req.params.test_id).populate("questions").exec(function(err,test){
         if(err)
         {
           console.log(err);
           res.render("error");
         }
         else
         {
           res.render("test/showsolutions",{test:test});
         }
       });
     });

     app.get("/showsolutionfor/:test_id/number/:no",isLoggedIn,function(req,res){

      var num=Number(req.params.no);
      console.log(num+1);
      Test.findById(req.params.test_id).populate("questions").exec(function(err,test){
        console.log("test is "+test);
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else
        {
          var len=test.questions.length;
          var ques=test.questions[num];
          console.log("ques is "+ques);
          if(num<len && num>-1){
            res.render("test/showsolutions2",{test:test,ques:ques,num:num});
          }
        }
      });
     });

     //=================================
     //========notification route=======
     //=================================

     app.get("/createnotification",function(req,res)
     {
       res.render("admin/not");
     });

     app.post("/createnotification",function(req,res)
     {
       Notification.create(req.body.not,function(err,not){
         if(err)
         {
           console.log(err);
         }
         else{
           req.flash("success","Notification created!");
           res.redirect("back")
         }
       })
     });

     app.delete("/not/:id",function(req,res){
       Notification.findByIdAndRemove(req.params.id,function(err,not){
         if(err)
         {
           console.log(err);
           res.redirect("back");
         }
         else{
          req.flash("success","Notification deleted!");
          res.redirect("back")
         }

       });
     });


     app.get("/registeradmin",function(req,res){

      res.render("admin/registeradmin");
     });

     app.get("/school",function(req,res){

      res.render("admin/school");
     });


app.get("/course/:id",checkingCourse,function(req,res){

  Course.find({},function(err,c){
  Course.findById(req.params.id).populate("subjects").exec(function(err,course)
  {
    if(err)
    {
      console.log(err);
      res.render(error);
    }
    else
    {
        res.render("courses/subjects",{course:course,c:c});
    }
  });
});
});

app.get("/course/:id/subject/:subject_id",checkingCourse,function(req,res){

  Subject.find({"detail.id":req.params.id},function(err,sub){
  Subject.findById(req.params.subject_id).populate("chapters").exec(function(err,subject)
  {
    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {
        
      res.render("courses/chapters",{subject:subject,sub:sub});
    }
  });

});
});



//for showing videos
app.get("/subject/:subject_id/chapter/:id",isLoggedIn,function(req,res){

  Chapters.find({"detail.id":req.params.subject_id},function(err,chapter){
    console.log(chapter);
  Chapters.findById(req.params.id).populate("videos").exec(function(err,chap)
  {
    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {
      res.render("courses/videos",{chap:chap,chapter:chapter});
    }
  });
});
});

//show test for a particular subject


  app.get("/register",function(req,res){

     res.render("register",{message:req.flash("error")});
   });

//===========Admin===========

app.get("/admin",isAdmin,function(req,res){

  User.find({},function(err,users){
    if(err)
    {
      console.log(err);
      res.render("error.ejs");
    }
    else
    {
          res.render("admin/admin",{users:users});
    } 
  });
});
//====================================
//===============School Admin=========
//====================================
app.get("/schooladmin",isSubAdmin,function(req,res){

  Doubt.find({},function(err,doubt){
    if(err)
    {
      console.log(err);
      res.render("error.ejs");
    }
    else
    {
          res.render("admin/schooladmin",{doubt:doubt});
    } 
  });
});

app.get("/admin/message",isAdmin,function(req,res){
  Message.find({},function(err,message){
    res.render("admin/admin1",{message:message});
  });
});



//=========Register User=============

app.post("/register",function(req,res){
  //console.log(req.body);
  var det={username:req.body.username,name:req.body.name,phone:req.body.phone,education:req.body.education,city:req.body.area,state:req.body.state};
 // console.log(det);
 var pass=req.body.password;
  User.register({username:req.body.username,name:req.body.name,phone:req.body.phone,education:req.body.education,city:req.body.area,state:req.body.state}, req.body.password,function(err, user){
		if(err){
			console.log(err);
			wrong = true;
			req.flash("error",err.message);
			 res.redirect("/register");
			return;
    }
    console.log("User is "+user);
		passport.authenticate("local")(req,res,function(){
      var output=`<li>Email: ${user.username}</li><br>
      <li>Password: ${pass}</li><br>`;
      var mail=String(user.username);
      console.log(mail);
      sending(output,"Login detais are:-",mail);
			req.flash("success","Welcome to YantroMitra "+user.name);
			res.redirect("/");
		});
	});
});
//==========================================

//=========Register User=============

app.post("/registerforadmin",function(req,res){
  //console.log(req.body);
  var det={username:req.body.username,name:req.body.name};
 // console.log(det);
 if(req.body.passcode === 'blahblah')
 {
   det.isAdmin=true;
 }
 var pass=req.body.password;
  User.register(det, req.body.password,function(err, user){
		if(err){
			console.log(err);
			wrong = true;
			req.flash("error",err.message);
			 res.redirect("/registerforadmin");
			return;
    }
    console.log("User is "+user);
		passport.authenticate("local")(req,res,function(){
      var output=`<li>Email: ${user.username}</li><br>
      <li>Password: ${pass}</li><br>`;
      var mail=String(user.username);
      console.log(mail);
      sending(output,"Login detais are:-",mail);
			req.flash("success","Welcome to YantroMitra "+user.name);
			res.redirect("/");
		});
	});
});
//==========================================

app.post("/registerforschool",function(req,res){
  //console.log(req.body);
  var det={username:req.body.username,name:req.body.name};
 // console.log(det);
 if(req.body.passcode === 'blahblah')
 {
   det.isSchoolAdmin=true;
 }
 var pass=req.body.password;
  User.register(det, req.body.password,function(err, user){
		if(err){
			console.log(err);
			wrong = true;
			req.flash("error",err.message);
			 res.redirect("/registerforschool");
			return;
    }
    console.log("User is "+user);
		passport.authenticate("local")(req,res,function(){
      var output=`<li>Email: ${user.username}</li><br>
      <li>Password: ${pass}</li><br>`;
      var mail=String(user.username);
      console.log(mail);
      sending(output,"Login detais are:-",mail);
			req.flash("success","Welcome to YantroMitra "+user.name);
			res.redirect("/");
		});
	});
});


//====LOGIN======================
app.get("/login",function(req,res){
  res.render("login");
});


//======LOGIN===========
app.post("/login",passport.authenticate("local",{
  successRedirect: "/",
  failureRedirect: "/login",
    failureFlash: 'Invalid username or password.'
  }),function(req, res){

});


//=========User Registeration Ends====



//====== LOG OUT =========

app.get("/logout",function(req,res){
	req.logout();
		req.flash("success","Successfully Logged Out!");
	res.redirect("/");
});

//=======LOG OUT ENDS======




//========== Sending Mail==========
app.post("/contactus",function(req,res){

  var email=req.body.email;
  var name=req.body.name;
  var subject=req.body.subject;
  var message=req.body.message;

  var obj={name:name,email:email,subject:subject,message:message};

  Message.create(obj,function(err,message)
  {
    if(err){
      console.log(err);
      res.render("error.ejs");

    }
    else{
      console.log(message);
    }
  });

  var output = `<p> There you go..</p>
  <br>
  <br>
  <ul style="list-style:none">
  <li>Name: ${name}</li><br>
  <li>Email: ${email}</li><br>
  <li>Subject: ${subject}</li><br>
  <li>Message: ${message}</li>
  </ul>`;

  sending(output,"He/She wants us to contact him/her!","sethivansh6@gmail.com");

  req.flash("success","Formed filled successfully, will contact you soon! ");


res.redirect("/");
});

app.post("/yantrostava",function(req,res){


  Yantro.create(req.body.yantro,function(err,message)
  {
    if(err){
      console.log(err);
          res.render("error.ejs");

    }
    else{
      console.log(message);
    }
  });

  var message=req.body.yantro;

  output = `<p> There you go..</p>
  <br>
  <br>
  <ul style="list-style:none">
  <li>Del1: ${message.del1}</li><br>
  <li>Del2: ${message.del2}</li><br>
  <li>Del3: ${message.del3}</li><br>
  <li>Taluka: ${message.taluka}</li><br>
  <li>Subject: ${message.district}</li><br>
  <li>Phone No.: ${message.phno}</li><br>
  <li>School Name: ${message.schoolname}</li><br>
  <li>School Email: ${message.schoolemail}</li><br>
  </ul>`;

  sending(output,"YantroStava Form Details!","sethivansh6@gmail.com");
  req.flash("success","Formed filled successfully, will contact you soon! ");

res.redirect("/");

});



//=================function sending mail==========

function sending(output,subject,email)
{
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'yantromit@gmail.com',
      pass: 'Password12$' // naturally, replace both with your real credentials or an application-specific password
    }
    });
    
    const mailOptions = {
    from: 'yantro@gmail.com',
    to: email,
    subject: subject,
    html: output
    };
    
    transporter.sendMail(mailOptions, function(error, info){
    if (error) {
    console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
    });
}


//============= MIDDLEWARE for logged In===============
function isLoggedIn(req,res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in!");
	res.redirect("/login");
}


//==============MIDDLEWARE FOR CHECKING OWNERSHIP=========
function checkingCourse(req,res ,next){
	// if user logged in?
	if(req.isAuthenticated()){
		Course.findById(req.params.id,function(err, course){
		if(err){
			console.log(err);
			req.flash("error","Course Not Found!")
			res.redirect("back");
		}
		else{
      // does user own the campground
      var x="admin";
			if(course.classcode === req.user.education || req.user.isAdmin == true || req.user.isSchoolAdmin == true){
				//console.log("hey");
				next();
				
			}else{
				req.flash("error","You don't have permission to access this page! :( ");
				res.redirect("back");
			}
		}
	});
		
	}else{
		req.flash("error","You need to be logged in!");
	res.redirect("/login");
		
	}
	
	
}

//==================================================

//==========Middle Ware for isAdmin=======

function isAdmin(req,res ,next){
	// if user logged in?
	if(req.isAuthenticated()){
   // console.log(req.user.username);
    if(req.user.isAdmin == true){
    next();
    }
    else{
      req.flash("error","You don't have permission to access this page!");
    res.redirect("/");
      
    }

	}else{
		req.flash("error","You don't have permission to access this page!");
	res.redirect("/");
		
	}
}

function isSubAdmin(req,res ,next){
	// if user logged in?
	if(req.isAuthenticated()){
   // console.log(req.user.username);
    if(req.user.isAdmin == true || req.user.isSchoolAdmin == true){
    next();
    }
    else{
      req.flash("error","You don't have permission to access this page!");
    res.redirect("/");
      
    }

	}else{
		req.flash("error","You don't have permission to access this page!");
	res.redirect("/");
		
	}
}


//===================================================
//==============Storing Data to Database=============
//===================================================


app.get("/dataentry",isSubAdmin,function(req,res){
  res.render("detailform/courseform.ejs");
});

//creating course
app.post("/createcourse",isSubAdmin,function(req,res){

  
      Course.create(req.body.course,function(err,course){
        if(err)
        {
          console.log(err);
          res.render("error.ejs");
        }
        else{
         console.log("Course is"+course);
         res.redirect("/subjectfor/"+course.id);
        }
      });
      
  
  

});

//creating subject

app.get("/subjectfor/:id",isSubAdmin,function(req,res){
  
  Course.findById(req.params.id,function(err,course){

    if(err)
    {
      console.log(err);
          res.render("error.ejs");
    }
    else
    {
      res.render("detailform/subjectform.ejs",{course:course});
    }
  })

  
});

app.post("/subjectfor/:id",isSubAdmin,function(req,res){

  Course.findById(req.params.id,function(err,course){

    if(err)
    {
      console.log(err);
      res.render("error.ejs");
    }
    else
    {

      Subject.create({name:req.body.name,link:req.body.link},function(err,subject)
      {
        if(err)
        {
          console.log(err);
        }
        else
        {

          subject.detail.course=course.name;
          subject.detail.id=req.params.id;
          subject.save();
          console.log(subject);
          course.subjects.push(subject);
          course.save();
          console.log(subject);
          req.flash("success","Subject: "+subject.name+" added successfully!");

          res.redirect("/chapterfor/"+subject.id+"/course/"+course.id);

        }
      });
    }
  });
});

//Adding new subject to a particular course

app.get("/addnewsubject",isSubAdmin,function(req,res){

  Course.find({},function(err,found){
    if(err){
    res.render("error.ejs");
    console.log(err);
    }
    else
    {
    //  console.log(found);
      res.render("detailform/newsubject",{course:found});
    }
  });
 
});
app.post("/newsubject",isSubAdmin,function(req,res){

  Course.find({classcode:req.body.classcode},function(err,found){
    found.forEach(function(f){
    //  console.log(f._id); 
      res.redirect("/subjectfor/"+f._id);
    })
  })

});

//creating chapter
app.get("/chapterfor/:subject_id/course/:course_id",isSubAdmin,function(req,res){


  Subject.findById(req.params.subject_id,function(err,subject){

    if(err)
    {
       console.log(err);
          res.render("error.ejs");
    }
    else
    {
      Course.findById(req.params.course_id,function(err,course){
        res.render("detailform/chapterform.ejs",{subject:subject,course:course})
      });
      
    }
  });
  
});

app.post("/chapterfor/:subject_id/course/:course_id",isSubAdmin,function(req,res)
{

Course.findById(req.params.course_id,function(err,course)
{
  //console.log("ADDED COURSE IS "+course);
  Subject.findById(req.params.subject_id,function(err,subject){

    Chapters.create({name:req.body.name},function(err,chap){

      chap.detail.id=subject.id;
      chap.detail.course=course.name;
      chap.detail.subject=subject.name;
      chap.save();
      subject.chapters.push(chap);
      subject.save();
      console.log(subject);

      req.flash("success","Chapter: "+chap.name+" added successfully!");
      res.redirect("/video/"+chap.id+"/subject/"+subject.id+"/course/"+course.id);
    });
  });
});

});

//Adding new chapter to a particular subject/course

app.get("/addnewchapter",isSubAdmin,function(req,res){

  Course.find({},function(err,found){
    if(err){
    res.render("error.ejs");
    console.log(err);
    }
    else
    {
      Subject.find({},function(err,subject){
      console.log(found);
      res.render("detailform/newchapter",{course:found,subject:subject});
      });
    }
  });
 
});
app.post("/newchapter",isSubAdmin,function(req,res){

  Course.find({classcode:req.body.classcode},function(err,found){
    found.forEach(function(f){
      //console.log(f._id); 
      Subject.find({name:req.body.subject,"detail.course":f.name},function(err,sub){

        if(err)
        {
          console.log(err);
        }

        sub.forEach(function(s){
          console.log(s._id); 
          res.redirect("/chapterfor/"+s._id+"/course/"+f._id);
        })

      })
      
    })
  })

});

//creating videos
app.get("/video/:chap_id/subject/:subject_id/course/:course_id",isSubAdmin,function(req,res){

  Course.findById(req.params.course_id,function(err,course)
  {
   // console.log("Found "+course);
  Subject.findById(req.params.subject_id,function(err,subject){
    //console.log("Found "+subject);

    Chapters.findById(req.params.chap_id,function(err,chap){
     // console.log("Found "+chap);


     res.render("detailform/videoform.ejs",{course:course,subject:subject,chap:chap});

    });


  });
});

});

app.post("/video/:chap_id/subject/:subject_id/course/:course_id",isSubAdmin,function(req,res){
  Course.findById(req.params.course_id,function(err,course)
  {
  Subject.findById(req.params.subject_id,function(err,subject){

    Chapters.findById(req.params.chap_id,function(err,chap){

      Videos.create(req.body.video,function(err,video)
      {
        video.detail.id=chap.id;
        video.detail.course=course.name;
        video.detail.chapter=chap.name;
        video.detail.subject=subject.name;
        video.save();
        chap.videos.push(video);
        chap.save();
        console.log(chap);
        req.flash("success","Video: "+video.caption+" added successfully!");
        res.redirect("/video/"+chap.id+"/subject/"+subject.id+"/course/"+course.id)
      });

    });


  });
});

});

//Adding new video to a particular subject/course/chapter

app.get("/addnewvideo",isSubAdmin,function(req,res){

  Course.find({},function(err,found){
    if(err){
    res.render("error.ejs");
    console.log(err);
    }
    else
    {
      Subject.find({},function(err,subject){
     // console.log(found);
     Chapters.find({},function(err,chap){

      res.render("detailform/newvideo",{course:found,subject:subject,chap:chap});
     });
    });
    }
  });
 
});
app.post("/newvideo",isSubAdmin,function(req,res){

  Course.find({classcode:req.body.classcode},function(err,found){
    found.forEach(function(f){
      //console.log(f._id); 
      Subject.find({name:req.body.subject,"detail.course":f.name},function(err,sub){

        if(err)
        {
          console.log(err);
        }
        else
        {

        sub.forEach(function(s){
          console.log(s._id); 
          Chapters.find({name:req.body.chapter,"detail.subject":s.name,"detail.course":f.name},function(err,chap){

            chap.forEach(function(chap){
           res.redirect("/video/"+chap.id+"/subject/"+s._id+"/course/"+f._id);
 
            });


        });
      });
      }

      });
      
    });
  });

});


//==========================================
//==========Done Adding to Database=========
//==========================================


app.get("/subject/:subject_id/chapter/:chap_id/edit",isSubAdmin,function(req, res){
	Chapters.findById(req.params.chap_id, function(err, chap){
		console.log(chap);
		if(err){
			res.redirect("back");
		}
		else{
			res.render("courses/editchapter",{chap: chap});
		}
	});
});

app.get("/chapter/:chapter_id/video/:video_id/edit",isSubAdmin,function(req, res){
	Videos.findById(req.params.video_id, function(err, video){
		console.log(video);
		if(err){
			res.redirect("back");
		}
		else{
			res.render("courses/editvideo",{video: video});
		}
	});
});


//deleting and editing.......chapters




app.put("/subject/:subject_id/chapter/:chap_id",isSubAdmin,function(req, res){
	Chapters.findByIdAndUpdate(req.params.chap_id,{ name:req.body.name}, function(err, updated){
    console.log("Updated is "+updated);
		if(err){
			res.redirect("back");
		}
		else{
      Subject.findById(req.params.subject_id,function(err,sub){

			req.flash("success","Chapter Updated Successfully!");
      res.redirect("/course/"+sub.detail.id+"/subject/"+req.params.subject_id);
      });
		}
	});
	
});





app.delete("/subject/:subject_id/chapter/:chapter_id",isSubAdmin,function(req,res)
{

  Chapters.findByIdAndDelete(req.params.chapter_id,function(err,chap)
  {

    if(err){
			res.redirect("back");
		} else{
			
			Subject.findById(req.params.subject_id,function(err,sub){
        if(err)
        {
          res.render(error);
          console.log(err);
        }
        else{
          req.flash("success","Chapter Deleted Successfully!");
          res.redirect("/course/"+sub.detail.id+"/subject/"+req.params.subject_id);
        }
      });
		}

  });
});





//deleting and editing videos


app.put("/chapter/:chap_id/video/:video_id",isSubAdmin,function(req, res){
	Videos.findByIdAndUpdate(req.params.video_id,req.body.video, function(err, updated){
    console.log("Updated is "+updated);
		if(err){
			res.redirect("back");
		}
		else{
      Chapters.findById(req.params.chap_id,function(err,chap){

			req.flash("success","Chapter Updated Successfully!");
      res.redirect("/subject/"+chap.detail.id+"/chapter/"+req.params.chap_id);
      });
		}
	});
	
});

app.delete("/chapter/:chapter_id/video/:video_id",isSubAdmin,function(req,res){

  Videos.findByIdAndRemove(req.params.video_id,function(err,video){

    if(err)
    {
      console.log(err);
      res.redirect("back");
    }
    else{

      Chapters.findById(req.params.chapter_id,function(err,chap){

        if(err)
        {
          res.render(error);
          console.log(err);
        }
        else{
          req.flash("success","Video Deleted Successfully!");
          res.redirect("/subject/"+chap.detail.id+"/chapter/"+req.params.chapter_id);
        }

      });
    }
  });
});


//============creating test and saving ============= 

app.get("/createtest",isSubAdmin,function(req,res){

  Course.find({},function(err,course){

    Subject.find({},function(err,subject){

      res.render("test/testfor",{course:course,subject:subject});

    });
  });
  
});

app.post("/createtest",isSubAdmin,function(req,res)
{
  console.log("entered psot");
  console.log(req.body.test.subject != 'none')
     if(req.body.test.subject != 'none'){
  Course.find({name:req.body.test.course},function(err,course){
    console.log("enterd courses")

    course.forEach(function(c){
      console.log("enterd courses for each");
    Subject.find({name:req.body.test.subject,"detail.course":req.body.test.course},function(err,subject){
      console.log(subject);
      if(err)
      {
        console.log(err);
      }
      else{
        console.log("enterd subject")
        subject.forEach(function(sub){
          console.log("enterd subject for each")
        res.redirect("/testfor/course/"+c._id+"/subject/"+sub._id);
      });
      }
      

   
  });
});
});
     }
     
     else{

      Course.find({classcode:req.body.test.course},function(err,course){

        course.forEach(function(c){

          res.redirect("/testfor/course/"+c._id);
        });
      });

     }
});

app.get("/testfor/course/:course_id/subject/:subject_id",isSubAdmin,function(req,res){

  var a="/testfor/course/"+req.params.course_id+"/subject/"+req.params.subject_id;
  res.render('test/title',{a:a});
});

app.get("/testfor/course/:course_id",isSubAdmin,function(req,res){

  var a="/testfor/course/"+req.params.course_id;
  res.render('test/title',{a:a});
});

//======================CREATE TEST================
//=================================================

app.post("/testfor/course/:course_id/subject/:subject_id",isSubAdmin,function(req,res){
  console.log("entered");

  Course.findById(req.params.course_id,function(err,course)
  {
    Subject.findById(req.params.subject_id,function(err,subject){

      Test.create({title:req.body.test.title,for:"subject",time:req.body.test.time,positive:req.body.test.positive,negative:req.body.test.negative},function(err,test)
      {
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else{
          test.detail.course_id=req.params.course_id;
          test.detail.subject_id=req.params.subject_id;
          test.detail.subject=subject.name;
          test.detail.course=course.classcode;
          test.save();
          subject.tests.push(test);
          subject.save();
          console.log("Subject is "+subject);
          console.log("Test is "+test);
          req.flash("success","Test Created Successfully!");
          res.redirect("/questionsfortest/"+test._id);
        }
      });

    });
  });
});

app.post("/testfor/course/:course_id",isSubAdmin,function(req,res){
  console.log("entered");

  Course.findById(req.params.course_id,function(err,course)
  {
      Test.create({title:req.body.test.title,for:"course",time:req.body.test.time},function(err,test)
      {
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else{
          test.detail.course_id=req.params.course_id;
          test.detail.subject="none";
          test.detail.course=course.classcode;
          test.save();
          course.tests.push(test);
          course.save();
          console.log("Course is "+course);
          console.log("Test is "+test);
          req.flash("success","Test Created Successfully!");
          res.redirect("/questionsfortest/"+test._id);
        }
      });

    });
  });



app.get("/questionsfortest/:id",isSubAdmin,function(req,res){

  Test.findById(req.params.id,function(err,test){

    res.render("test/questionsfortest",{test:test});

  });

});

app.post("/questionsfortest/:id",isSubAdmin,upload.single('image'),function(req,res){

  Test.findById(req.params.id,function(err,test){

    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {

      console.log(req.body.ques);
      if(req.file != undefined){
        cloudinary.uploader.upload(req.file.path, function(err,result) {
          // add cloudinary url for the image to the campground object under image property
           req.body.ques.ques_image = result.secure_url;
         // add author to campground
        
        Question.create(req.body.ques,function(err,ques){
  
          if(err)
          {
            console.log(err);
            res.render("error");
          }
          else{
  
            ques.detail.id=test._id;
            ques.detail.test=test.title;
            ques.detail.subject=test.detail.subject;
            ques.detail.course=test.detail.course;
            ques.save();
            console.log("Ques is "+ques);
            test.questions.push(ques);
            test.save();
            console.log("Test is "+test);
            req.flash("success","Question for "+test.title+" Created Successfully!");
            res.redirect("/questionsfortest/"+test._id);
          }
        });
      });
      }
      else{
        Question.create(req.body.ques,function(err,ques){
  
          if(err)
          {
            console.log(err);
            res.render("error");
          }
          else{
  
            ques.detail.id=test._id;
            ques.detail.test=test.title;
            ques.detail.subject=test.detail.subject;
            ques.detail.course=test.detail.course;
            ques.save();
            console.log("Ques is "+ques);
            test.questions.push(ques);
            test.save();
            console.log("Test is "+test);
            req.flash("success","Question for "+test.title+" Created Successfully!");
            res.redirect("/questionsfortest/"+test._id);
          }
        });
      }
    }
      
  });

});

//====================================================================
//==========create doubts and send to admin and receive it=============
//=====================================================================

app.post("/senddoubt/:chap_id/user/:user_id",isLoggedIn,function(req,res){

  Chapters.findById(req.params.chap_id,function(err,chap){

    if(err)
    {
      console.log(err);
    }
    else
    {
      Doubt.create({doubt:req.body.doubt,chapter:chap.name,subject:chap.detail.subject,course:chap.detail.course},function(err,doubt){
        if(err)
        {
          console.log(err);
          res.render("error");
        }
        else
        {
          User.findById(req.params.user_id,function(err,user){
            if(err)
            {
              console.log(err);
            }
            else
            {
              doubt.username=user.name;
              doubt.save();
              user.doubts.push(doubt);
              console.log("Doubt is "+doubt);

              user.save();
              console.log("user is "+user);
              res.redirect("back");
            }
          });
        }
      });
    }
  });
});

app.get("/showdoubtadmin",isSubAdmin,function(req,res){
  Doubt.find({},function(err,doubt){
    if(err)
    {
      console.log(err);
    }
    else{
      res.render("admin/showdoubtadmin",{doubt:doubt});
    }
  });
});



app.post("/addanswertodoubt/:doubt_id",isSubAdmin,function(req,res){

  Doubt.findByIdAndUpdate(req.params.doubt_id,{answer:req.body.answer,isAnswered:true},function(err,doubt){
    if(err)
    {
      console.log(err);
    }
    else
    {
      console.log("doubt issssssssssss "+doubt);
      req.flash("success","Answer Posted Successfully!");
      res.redirect("back");
    }
  });
});

app.get("/seedoubtsforuser/:user_id",isLoggedIn,function(req,res){
  User.findById(req.params.user_id).populate("doubts").exec( function(err,user){
    if(err)
    {
      console.log(err);
      res.render("error");
    }
    else
    {
      console.log("User is =========== "+user);
      console.log("User is =========== "+user.doubts);
      res.render("courses/showdoubtuser",{user:user});
    }

  });
});


app.listen(process.env.PORT || 3000,function(){
  console.log("Yeah I am connected");
});