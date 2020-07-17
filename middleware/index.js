var Blog    = require("../models/blog");
    Comment = require("../models/comment");

    
var middlewareObj={};

//To check if the user is the author some specific blog
middlewareObj.checkBlogOwnership = function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Blog.findById(req.params.id, function(err, foundBlog)
        {
            if(err)
            {
                console.log(err);
                res.redirect("back");
            }
            else
            {
                if(req.user._id.equals(foundBlog.author.id))   //we cant use === because Blog author is a mongoose object while user id is a string
                    next();
                else
                {
                    res.redirect("back");
                }
            }
        })
    }
    else
    {
        res.redirect("back");
    }
}

//To check if the user is the author some comment in a blog
middlewareObj.checkCommentOwnership=function(req,res,next)
{
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, foundComment)
        {
            if(err)
            {
                res.redirect("back");
            }
            else
            {
                if(req.user._id.equals(foundComment.author.id))   //we cant use === because campground author is a mongoose object while user id is a string
                   next();
                else
                {
                    res.redirect("back");
                }
            } 
        })
    }
    else
    {
        res.redirect("back");
    }
}

//To check if user is logged in
middlewareObj.isLoggedIn = function(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect("/login")
}

module.exports = middlewareObj