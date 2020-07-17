var express     = require("express");
    passport    = require("passport");
    User        = require("../models/user");
    multer      = require('multer'); 
    router      = express.Router();
    fs          = require('fs');
    path        = require('path');



// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/uploads')                             //null is the error field and uploads is the folder name where pictures will be stored
    },
    filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname))     //fieldname is the name given to the upload input box in the html file and path is used to get the file extension name
    }
})  
var upload = multer({ storage: storage })


router.get("/",function(req,res)
{
    res.render("landing");
})


//AUTH Routes
router.get("/register",function(req,res)
{
    res.render("register", {user: req.user});
})

router.post("/register", upload.single('myImage'), function(req,res)
{
    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');          
    var finalImg = {                                    // Define a JSONobject for the image attributes for saving to database
        contentType: req.file.mimetype,
        path:req.file.path,
        image:  new Buffer(encode_image, 'base64')
    };
    var newUser = new User({username: req.body.username, about: req.body.about, img: finalImg});
    User.register(newUser,req.body.password,function(err,user)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/register");
        }
        passport.authenticate("local")(req,res, function()
        {
            //res.contentType(user.img.contentType);
            //res.send(user.img.image);
            res.redirect("/blogs");
        })
    })
})

router.get("/login",function(req,res)
{
    res.render("login", {user: req.user})
})

router.post("/login",passport.authenticate("local",
    {
        successRedirect: "/blogs",
        failureRedirect: "/login"
    }),function(req,res){
})

router.get("/logout",function(req,res)
{
    req.logout();
    res.redirect("/blogs");
})



module.exports=router;