var express     = require("express");
    Blog        = require("../models/blog");
    User        = require("../models/user");
    db          = require("mongoose"); 
    router      = express.Router();
    middleware  = require("../middleware")



//Display profile page of logged in user
router.get("/profile", middleware.isLoggedIn, function(req,res)
{
    var userBlogs=[];
    req.user.Blogs.forEach(function(blogId)
    {
        Blog.findById(blogId, function(err, foundBlog)
        {
            if(err)
            {
                console.log(err);
            }
            else
            {
                userBlogs.push({id: foundBlog._id, text: foundBlog.text, title: foundBlog.title, image: foundBlog.image});
            }
        })
    });
    setTimeout( function()
    {
    res.render("profile", {Puser: req.user, user: req.user, userBlogs: userBlogs});
    },500);
})


//Display profile page of other users
router.get("/profile/:id", function(req,res)
{
    var profileUser;
    User.findById(req.params.id, function(err, foundUser)
    {
        if(err)
            console.log(err)
        else
        {
            profileUser=foundUser;
        }
    })
    var userBlogs=[];
    setTimeout(function()
    {
        profileUser.Blogs.forEach(function(blogId)
        {
            Blog.findById(blogId, function(err, foundBlog)
            {
                if(err)
                {
                    console.log(err);
                }
                else
                {
                    userBlogs.push({id: foundBlog._id, text: foundBlog.text, title: foundBlog.title, image: foundBlog.image});
                }
            })
        })
    },400);
    setTimeout( function()
    {
    res.render("profile", {Puser: profileUser, userBlogs: userBlogs, user: req.user});
    },600);
})


module.exports = router;