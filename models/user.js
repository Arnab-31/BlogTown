var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
    likedBlogs: [
        {                                                //we store the blog ids which the user has liked
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    Blogs: [
        {                                                //we store the blog ids which the user has writen
            type: mongoose.Schema.Types.ObjectId,
            ref: "Blog"
        }
    ],
    username: String,
    password: String,
    about: String,
    img: { image: Buffer, contentType: String, path: String }
})
UserSchema.plugin(passportLocalMongoose);                    //adds some useful functions to the User 
module.exports = mongoose.model("User",UserSchema);