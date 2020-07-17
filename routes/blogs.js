var express     = require("express");
    Blog        = require("../models/blog");
    User        = require("../models/user");
    db          = require("mongoose"); 
    router      = express.Router();
    middleware  = require("../middleware")


//Display All Blogs
router.get("/blogs",function(req,res)
{
    Blog.find({}, function(err, allBlogs)
    {
        if(err)
            console.log(err);
        else
            res.render("blogs/index", {blogs: allBlogs, user: req.user});
    })
})


//Create new Blog
router.get("/blogs/new", middleware.isLoggedIn, function(req,res)
{
    res.render("blogs/new", {user: req.user});
})

router.post("/blogs", middleware.isLoggedIn, function(req,res)
{
    var user = {
        id: req.user._id,
        img: req.user.img,
        username: req.user.username
    }
    var newBlog = {title: req.body.blog.title, image: req.body.blog.image, text: req.body.blog.text, author: user}
    Blog.create(newBlog, function(err,newlyCreated)
    {
        if(err)
        {
            console.log(err);
        }
        else{
            req.user.Blogs.push(newlyCreated._id);
            req.user.save();
            res.redirect("/blogs")
        }
    })
})


//Show a specific blog
router.get("/blogs/:id",function(req,res)
{
    Blog.findById(req.params.id).populate("comments").exec(function(err, foundBlog)      //we use populate to access all the content of comments present in the blog like text and username, and not just the id whcih we stored
    {
        if(err)
        {
            console.log(err);
            res.redirect("/blogs");
        }
        else
        {
            var myDate = new Date();                         
                        day    = myDate.getDate();
                        month  = myDate.getMonth();
                        year   = myDate.getFullYear();
            res.render("blogs/show",{blog:foundBlog, user: req.user, day: day, month: month, year: year});
        }
    })
})


//Edit a Blog
router.get("/blogs/:id/edit", middleware.checkBlogOwnership, function(req,res)
{
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/blogs/"+ req.params.id);
        }
        else
        {
            res.render("blogs/edit", {blog: foundBlog, user: req.user})
        }
    })
})

router.put("/blogs/:id", middleware.checkBlogOwnership, function(req,res)
{
    Blog.findByIdAndUpdate(req.params.id, req.body.blog,function(err, updatedBlog)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/blogs");
        }
        else
        {
            res.redirect("/blogs/"+ req.params.id);
        }
    })
})


//Destroy Blog
router.delete("/blogs/:id", middleware.checkBlogOwnership, function(req,res)
{
    Blog.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            console.log(err);
            res.redirect("blogs");
        }
        else
        {
            res.redirect("/blogs");
        }
    })
})


//Liked A Blog
router.post("/blogs/:id/like", middleware.isLoggedIn, function(req,res)
{
    //update blog like count 
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/blogs/"+ req.params.id);
        }
        else
        {
            foundBlog.likes = foundBlog.likes + 1;
            foundBlog.save();
            req.user.likedBlogs.push(foundBlog._id);         //update user data accordingly
            req.user.save();
            setTimeout( function()
            {
                res.redirect("/blogs/"+ req.params.id);
            },500);
        }
    })
})


//UnLiked A Blog
router.post("/blogs/:id/unlike", middleware.isLoggedIn, function(req,res)
{
    //update blog like count 
    Blog.findById(req.params.id,function(err,foundBlog)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/blogs/"+ req.params.id);
        }
        else
        {
            foundBlog.likes = foundBlog.likes - 1;
            foundBlog.save();
            const index = req.user.likedBlogs.indexOf(5);
            req.user.likedBlogs.splice(index, 1);               //update user data accordingly
            req.user.save();
            setTimeout( function()
            {
                res.redirect("/blogs/"+ req.params.id);
            },500);
        }
    })
})

//search a blog
router.get("/search",function(req,res)
{
    var pre_value="";
    res.render("search",{foundBlogs: null, user: req.user, pre_value:pre_value});
})

router.post("/search", function(req,res)
{
    var pre_value="";
    var q=req.body.q;
    pre_value=q;
    /*
    //Full Search
    Blog.find({
        $text :{
            $search: q
        }
    },{
        __v:0       //it removes __v from the found data
    },function(err,data)
    {
        res.render("search",{foundBlogs: data})
    }*/

    //Partial Search
    Blog.find({
        title :{
            $regex: q,
            $options: "i"
        }
    },{
        __v:0       //it removes __v from the found data
    },function(err,data)
    {
        res.render("search",{foundBlogs: data, user: req.user, pre_value: pre_value})
    }
)});

module.exports = router;