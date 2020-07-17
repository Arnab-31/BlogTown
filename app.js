var express               = require("express");             //To use express.js
    mongoose              = require("mongoose");            //To use mongo.db
    bodyParser            = require("body-parser");         //To parse POST request data and put it into req.body
    multer                = require('multer');              //To upload files
    methodOverride        = require("method-override");     //To use routes other than GET and POST
    passport              = require("passport");            //To use passport for authorization and authentication
    LocalStrategy         = require("passport-local");
    passportLocalMongoose = require("passport-local-mongoose");
    Comment               = require("./models/user");
    User                  = require("./models/user");
 


var app = express();
 
//To use routes other than GET and POST
app.use(methodOverride("_method"));


//support parsing of application form post data
app.use(bodyParser.urlencoded({
    extended: true
}));


//To use external css files from the public directory
app.use('/public', express.static('public')); 


//Preventing depreciation errors in mongodb
     app.set("view engine","ejs");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);


//Connecting to Database
var url = process.env.DATABASEURL || "mongodb://localhost/BlogTown"
mongoose.connect("mongodb://localhost/BlogTownOfficial");


//Setting up passport
app.use(require("express-session")({
    secret: "Its a secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//requiring routes
var commentRoutes      = require("./routes/comments");
var blogRoutes         = require("./routes/blogs");
var indexRoutes        = require("./routes/index");
var profileRoutes      = require("./routes/profile");
//using routes
app.use(indexRoutes);
app.use(blogRoutes);
app.use(commentRoutes);
app.use(profileRoutes);


//Listening to server
app.listen(5000,function()  //replace process.env.PORT, process.env.IP with 5000 if running in local
{
    console.log("Serving BlogTown on port 5000");
})