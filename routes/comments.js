var express     = require("express");
    Blog        = require("../models/blog");
    Comment     = require("../models/comment");
    router      = express.Router({mergeParams: true});       //mergeParams is required as we are using  nested routing, to acess parameters from parent route like blog id
    middleware  = require("../middleware")


//Create New Comment
router.post("/blogs/:id/comments", middleware.isLoggedIn, function(req,res)
{
    Blog.findById(req.params.id,function(err, foundBlog)
    {
        if(err)
        { 
            console.log(err);
            res.redirect("/blogs");
        }
        else
        {
            Comment.create(req.body.comment,function(err,newComment)
            {
                if(err)
                { 
                    console.log(err);
                    res.redirect("/blogs");
                }
                else
                {
                    var myDate = new Date();                           //Getting the timestamp at the time of comment creation
                        day   = myDate.getDate();
                        month  = myDate.getMonth();
                        year   = myDate.getFullYear();
                    newComment.timestamp.day  = day;
                    newComment.timestamp.month = month;
                    newComment.timestamp.year  = year;
                    newComment.author.id = req.user._id;
                    newComment.username = req.user.username;
                    newComment.save();
                    foundBlog.comments.push(newComment);
                    foundBlog.save();
                    res.redirect("/blogs/"+ foundBlog._id);
                }
            })
        }
    })
})


//Edit a Comment
router.put("/blogs/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req,res)
{
    Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err, updatedComment)
    {
        if(err)
        {
            console.log(err);
            res.redirect("back");
        }
        else
        {   
            res.redirect("/blogs/" + req.params.id);
        }
    })
})

 
//DESTROY COMMENT
router.delete("/blogs/:id/comments/:comment_id" ,middleware.checkCommentOwnership, function(req,res)
{
    Comment.findByIdAndDelete(req.params.comment_id,function(err)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/blogs/"+req.params.id)
        }
    })
})


module.exports=router;