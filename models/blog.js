var mongoose = require("mongoose");

var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    text: String,
    comments: [                                                //tells it is an array of comments
        {
            type: mongoose.Schema.Types.ObjectId,              //we only store the comment id which we can use to see all the contents of the comment using populate
            ref: "Comment"
        }
    ],
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        img: { image: Buffer, contentType: String, path: String },
        username: String
    },
    likes: { type:Number, default:0 }
})
module.exports = mongoose.model("Blog",blogSchema);